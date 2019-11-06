import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ExportService } from 'src/app/services/export.service';

declare var jQuery: any;

@Component({
  selector: 'app-nba',
  templateUrl: './nba.component.html',
  styleUrls: ['./nba.component.scss']
})
export class NbaComponent implements OnInit {

  //Variables
  selected: any;
  currentNav: any;
  nbaTeams: any;
  avgPos: any;
  avgOff: any;
  firstTeam: any;
  secondTeam: any;
  homeWinChance: any;
  awayWinChance: any;
  homeScore: any;
  awayScore: any;
  winner: any;
  spread: any;
  confidenceScore: any;
  overUnder: any;
  totalPoints: any;
  leftScore: any;
  rightScore: any;
  leftWinner: any;
  rightWinner: any;
  loading: any;
  dataLoading = false;
  rowData = [];

  gridApi: any;
  gridColumnApi: any;

  firstHome = true;
  secondHome = false;

  rowSelection = 'multiple';
  columnDefs = [
    {headerName: 'Team', field: 'leftTeam', checkboxSelection: true },
    {headerName: 'Score', field: 'leftScore' },
    {headerName: 'Spread', field: 'spread'},
    {headerName: 'Total Points', field: 'totalPoints'},
    {headerName: 'Score', field: 'rightScore'},
    {headerName: 'Team', field: 'rightTeam'},
    {headerName: 'Confidence %', field: 'confidence'},
    {headerName: 'Game Time', field: 'gameTime'}
  ];

  matchups = [];

  query = {
    order: 'name',
    limit: 5,
    page: 1
  }

  constructor(
    private http: HttpClient,
    private _exportService: ExportService
    ) {}

  ngOnInit() {
    this.dataLoading = true;
    this.getNbaData((data) => {
      this.nbaTeams = data;
      this.calculateAverages();
      this.dataLoading = false;
    })
  }

  exportTable() {
    this.rowData = [];
    this.gridApi.forEachNode(node => this.rowData.push(node.data));
    this._exportService.exportAsExcelFile(this.rowData, "Matchups");
  }

  getNbaData(cb) {
    //NBA Data Call
    const req = new XMLHttpRequest();
    // DEV
    // req.open('GET', 'http://localhost:3000/assets/nba-data.json');
    // PROD
    req.open('GET', 'https://firestore.googleapis.com/v1beta1/projects/hoopfire-api/databases/(default)/documents/nba-teams?pageSize=50&key=a9d366bac3abc2f55bca7a4fa84512befed452f2');
    req.onload = () => {
      // DEV
      // const rows = JSON.parse(req.response);
      // PROD
      let data = JSON.parse(req.response);
      const rows = data.documents;
      cb(rows);
    };
    req.send();
  }

  getTodaysSchedule() {
    this.loading = true;
    var date = new Date();
    date.setDate(date.getDate());
    date.setHours(0, 0, 0, 0);

    var structuredQuery = {
      "structuredQuery": {
        "where": {
          "fieldFilter": {
            "field": {
              "fieldPath": "date"
            },
            "op": "EQUAL",
            "value": {
              "stringValue": date.toISOString()
            }
          }
        },
        "from": [{
          "collectionId": "nba-schedule"
        }]
      }
    }

    let scope = this;
    jQuery.ajax({
      url: "https://firestore.googleapis.com/v1beta1/projects/hoopfire-api/databases/(default)/documents:runQuery?",
      key: "a9d366bac3abc2f55bca7a4fa84512befed452f2",
      type: "POST",
      dataType: "json",
      data: JSON.stringify(structuredQuery),
      contentType: "application/json",
      success: function (parsed_json) {
        scope.calculateTodaysGames(parsed_json);
        scope.loading = false;
      }
    });
  }

  calculateTodaysGames(data) {
    var homeTeam, awayTeam, gameTime, todaysMatchups = [];
    this.toggleHomeCourt('left');
    let scope = this;
    data.forEach(function (matchup) {
      scope.nbaTeams.forEach(function (team) {
        if (team.fields.team.stringValue === matchup.document.fields.home.stringValue) {
          homeTeam = team;
        }
        if (team.fields.team.stringValue === matchup.document.fields.away.stringValue) {
          awayTeam = team;
        }
        gameTime = matchup.document.fields.start.stringValue;
      });
      if (homeTeam && awayTeam) {
        todaysMatchups.push([homeTeam, awayTeam, gameTime]);
      }
    });

    if (todaysMatchups.length > 0) {
      todaysMatchups.forEach(function (matchup) {
        scope.firstTeam = matchup[0];
        scope.secondTeam = matchup[1];

        scope.calculateOdds();
        scope.addMatchup(matchup[2]);
      });
    }
    this.rowData = [];
    this.gridApi.forEachNode(node => this.rowData.push(node.data));
  }

  onChange(num, evt){
    if(this.firstTeam && this.secondTeam){
      this.calculateOdds()
    }
  }

  onRemoveSelected() {
    var selectedData = this.gridApi.getSelectedRows();
    var res = this.gridApi.updateRowData({ remove: selectedData });
  }

  addMatchup(gameTime) {
    var matchup = {
      "leftTeam": this.firstTeam.fields.team.stringValue,
      "leftScore": this.leftScore,
      "spread": this.winner.fields.team.stringValue + " " + this.spread,
      "totalPoints": this.totalPoints,
      "rightScore": this.rightScore,
      "rightTeam": this.secondTeam.fields.team.stringValue,
      "confidence": this.confidenceScore + "%",
      "gameTime": "User Generated",
      "remove": ""
    };

    if(gameTime) {
      matchup.gameTime = gameTime;
    }
    var res = this.gridApi.updateRowData({ add: [matchup] });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    
    this.gridApi.sizeColumnsToFit();
  }

  toggleHomeCourt(side){
    if(side === "left") {
      if(!this.firstHome) {
        jQuery("#homeLeft").toggleClass("home-icon-color");
        this.firstHome = true;
        jQuery("#homeRight").toggleClass("home-icon-color");
        this.secondHome = false;

        this.calculateOdds();
      }
    } else if(side === "right") {
      if(!this.secondHome) {
        jQuery("#homeRight").toggleClass("home-icon-color");
        this.secondHome = true;
        jQuery("#homeLeft").toggleClass("home-icon-color");
        this.firstHome = false;

        this.calculateOdds();
      }
    }
  }

  calculateAverages() {
    let scope = this;
    scope.nbaTeams.forEach(function (element) {
      if (element.fields.team.stringValue === "League Average") {
        scope.avgPos = element.fields.pace.stringValue;
        scope.avgOff = element.fields.oRtg.stringValue;
      }
    });
  }

  calculateOdds() {
    if (this.firstTeam && this.secondTeam) {
      var awayTeam, homeTeam;
      var adv = .010;
      if (this.firstHome) {
        homeTeam = this.firstTeam;
        awayTeam = this.secondTeam;
      } else if (this.secondHome) {
        homeTeam = this.secondTeam;
        awayTeam = this.firstTeam;
      }

      var adjHomeOff = Number(homeTeam.fields.oRtg.stringValue) + Number(homeTeam.fields.oRtg.stringValue) * adv;
      var adjHomeDef = Number(homeTeam.fields.dRtg.stringValue) - Number(homeTeam.fields.dRtg.stringValue) * adv;

      var adjAwayOff = Number(awayTeam.fields.oRtg.stringValue) - Number(awayTeam.fields.oRtg.stringValue) * adv;
      var adjAwayDef = Number(awayTeam.fields.dRtg.stringValue) + Number(awayTeam.fields.dRtg.stringValue) * adv;

      var pythExp = 10.25;
      var adjHomePyth = Math.pow(adjHomeOff, pythExp) / (Math.pow(adjHomeOff, pythExp) + Math.pow(adjHomeDef, pythExp));
      var adjAwayPyth = Math.pow(adjAwayOff, pythExp) / (Math.pow(adjAwayOff, pythExp) + Math.pow(adjAwayDef, pythExp));

      var homeWinChance = (adjHomePyth - adjHomePyth * adjAwayPyth) / (adjHomePyth + adjAwayPyth - 2 * adjHomePyth * adjAwayPyth);
      this.homeWinChance = homeWinChance * 100;
      this.awayWinChance = (1 - homeWinChance) * 100;
      this.homeWinChance = this.homeWinChance.toFixed(0);
      this.awayWinChance = this.awayWinChance.toFixed(0);

      var adjPos = ((awayTeam.fields.pace.stringValue / this.avgPos) * (homeTeam.fields.pace.stringValue / this.avgPos)) * this.avgPos;

      var awayScoreDecimal = (((adjAwayOff / this.avgOff) * (adjHomeDef / this.avgOff)) * (this.avgOff) * (adjPos / 100));
      this.awayScore = Number(awayScoreDecimal.toFixed(0));
      var homeScoreDecimal = (((adjHomeOff / this.avgOff) * (adjAwayDef / this.avgOff)) * (this.avgOff) * (adjPos / 100));
      this.homeScore = Number(homeScoreDecimal.toFixed(0));

      var decSpread = Math.abs(homeScoreDecimal - (awayScoreDecimal));

      if (homeScoreDecimal > awayScoreDecimal) {
        this.spread = "-" + (Math.round(decSpread * 2) / 2).toFixed(1);
        this.winner = homeTeam;
        this.confidenceScore = this.homeWinChance;
      } else {
        this.spread = "-" + (Math.round(decSpread * 2) / 2).toFixed(1);
        this.winner = awayTeam;
        this.confidenceScore = this.awayWinChance;
      }

      if (this.firstHome) {
        this.leftScore = this.homeScore;
        this.rightScore = this.awayScore;
        if (homeScoreDecimal > awayScoreDecimal) {
          this.leftWinner = true;
          this.rightWinner = false;
        } else {
          this.leftWinner = false;
          this.rightWinner = true;
        }
      } else if (this.secondHome) {
        this.leftScore = this.awayScore;
        this.rightScore = this.homeScore;
        if (homeScoreDecimal > awayScoreDecimal) {
          this.leftWinner = false;
          this.rightWinner = true;
        } else {
          this.leftWinner = true;
          this.rightWinner = false;
        }
      }


      this.overUnder = (awayScoreDecimal + homeScoreDecimal).toFixed(2);
      this.totalPoints = this.homeScore + this.awayScore;
    }
  }

}
