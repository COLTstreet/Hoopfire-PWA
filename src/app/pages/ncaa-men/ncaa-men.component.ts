import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { startWith, map, mergeMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { InjuriesComponent } from 'src/app/dialogs/injuries/injuries.component';
import { AlertService } from 'src/app/services/alert.service';

declare var jQuery: any;

@Component({
  selector: 'app-ncaa-men',
  templateUrl: './ncaa-men.component.html',
  styleUrls: ['./ncaa-men.component.scss']
})
export class NcaaMenComponent implements OnInit {
  teamOneControl = new FormControl();
  teamTwoControl = new FormControl();

  public statsData: any;

  public teamsList: any = [];
  filteredTeamsListOne: Observable<any[]> | undefined;
  filteredTeamsListTwo: Observable<any[]> | undefined;

  public todaysGames: any = [];

  public selectedHomeTeam: any;
  public selectedHomeTeamStats: any;
  public selectedHomeInfo: any;
  public selectedHomeTeamInjuries: any;

  public selectedAwayTeam: any;
  public selectedAwayTeamStats: any;
  public selectedAwayInfo: any;
  public selectedAwayTeamInjuries: any;

  allInjuries: any;
  allTeamSeasonStats: any;

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
  homeTeamPPG: any;
  awayTeamPPG: any;
  homeTeamOPPG: any;
  awayTeamOPPG: any;

  firstHome = true;
  secondHome = false;

  neutral = false;



  matchups: any[] = [];

  gridApi: any;
  gridColumnApi: any;

  public rowSelection: any;
  public columnDefs = [
    {headerName: 'Team', field: 'leftTeam', checkboxSelection: true },
    {headerName: 'Score', field: 'leftScore' },
    {headerName: 'Spread', field: 'spread'},
    {headerName: 'Total Points', field: 'totalPoints'},
    {headerName: 'Score', field: 'rightScore'},
    {headerName: 'Team', field: 'rightTeam'},
    {headerName: 'Confidence %', field: 'confidence'},
    {headerName: 'Game Time', field: 'gameTime', valueFormatter: dateFormatter }
  ];

  public defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    wrapText: true,
    cellStyle: {fontSize: '11px'}
  };

  constructor(public _dataService: DataService, public _alertService: AlertService, public injuryDialog: MatDialog) {
    this.rowSelection = 'multiple';
    this._dataService.getNCAAMAnalytics().subscribe((response: any) => {
      this.statsData = response.map((ret: any) => 
        Object.assign({id : ret.payload.doc.id}, ret.payload.doc.data())
      );
      
      this.calculateAverages();
      this.filterTeams();
    })

    this._dataService.getNCAAMTeams().subscribe((response: any) => {
      this.teamsList = response.sort((a: any, b: any) => a.School.localeCompare(b.School))
      this.filterTeams();
    })

    this._dataService.getTodaysNCAAMSchedule().subscribe((response: any) => {
      this.todaysGames = response;
    })
    this._dataService.getAllNCAAMTeamSeasonStats().subscribe((response: any) => {
      this.allTeamSeasonStats = response;
    })
    this._dataService.getAllNCAAMInjuries().subscribe((response: any) => {
      this.allInjuries = response;
    })
  }

  ngOnInit(): void {
    document.body.style.backgroundColor = "#EAE9E4"
  }

  displayTeamNameFn(team: any): any {
    return team && team.School ? team.School : '';
  }

  private _filterTeamNames(team: any): any[] {
    const filterValue = team.toLowerCase();

    return this.teamsList.filter((option: any) => option.School.toLowerCase().includes(filterValue));
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  filterTeams() {
    if(this.statsData && this.teamsList) {
      let temp = [];
      for (const key in this.teamsList) {
        let ele = this.teamsList[key];
        let found = this.statsData.some((r: any) => ele.School.toLowerCase().includes(r.team.split(" ")[0].toLowerCase()))
        if(found) temp.push(ele);
      }

      this.teamsList = temp;

      this.filteredTeamsListOne = this.teamOneControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.School),
          map(mb => mb ? this._filterTeamNames(mb) : this.teamsList.slice())
        );

      this.filteredTeamsListTwo = this.teamTwoControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.School),
          map(mb => mb ? this._filterTeamNames(mb) : this.teamsList.slice())
        );
    }
  }
  
  onBtnExport() {
    this.gridApi.exportDataAsCsv();
  }

  deleteSelectedRows() {
    var selectedData = this.gridApi.getSelectedRows();
    this.gridApi.updateRowData({ remove: selectedData });
  }

  showTeamInjuries(val: any) {
    if(val === 1) {
      let dialogRef = this.injuryDialog.open(InjuriesComponent, { width: '80%', height: '30%', data: { injuries: this.selectedHomeTeamInjuries, primaryColor: null, type: 'NCAAM'} });
    } else {
      let dialogRef = this.injuryDialog.open(InjuriesComponent, { width: '80%', height: '30%', data: { injuries: this.selectedAwayTeamInjuries, primaryColor: null, type: 'NCAAM'} });
    }
  }

  setSelectedHomeTeam() {
    this.selectedHomeTeamStats = this.statsData.filter((tm: any) => tm.id.toLowerCase().includes(this.selectedHomeTeam.School.toLowerCase()))[0]
    this.selectedHomeInfo = this.allTeamSeasonStats.filter((tm: any) => tm.Name.toLowerCase().includes(this.selectedHomeTeam.School.toLowerCase().toLowerCase()))[0]

    this.homeTeamPPG = (this.selectedHomeInfo.Points / (this.selectedHomeInfo.Wins + this.selectedHomeInfo.Losses)).toFixed(1)

    this.selectedHomeTeamInjuries = this.allInjuries.filter((inj: any) => inj.Team.toLowerCase().includes(this.selectedHomeTeam.Key.toLowerCase()))

    this.firstTeam = this.selectedHomeTeamStats;
    this.calculateOdds()
  }

  setSelectedAwayTeam() {
    this.selectedAwayTeamStats = this.statsData.filter((tm: any) => tm.id.toLowerCase().includes(this.selectedAwayTeam.School.toLowerCase()))[0]
    this.selectedAwayInfo = this.allTeamSeasonStats.filter((tm: any) => tm.Name.toLowerCase().includes(this.selectedAwayTeam.School.toLowerCase().toLowerCase()))[0]

    this.awayTeamPPG = (this.selectedAwayInfo.Points / (this.selectedAwayInfo.Wins + this.selectedAwayInfo.Losses)).toFixed(1)

    this.selectedAwayTeamInjuries = this.allInjuries.filter((inj: any) => inj.Team.toLowerCase().includes(this.selectedAwayTeam.Key.toLowerCase()))

    this.secondTeam = this.selectedAwayTeamStats;
    this.calculateOdds()
  }

  onChange(num: any, evt: any){
    if(this.firstTeam && this.secondTeam){
      this.calculateOdds()
    }
  }

  calculateTodaysGames() {
    this.gridApi.setRowData([]);
    let homeTeam: any;
    let awayTeam: any;
    let gameTime: any;
    let todaysMatchups = [];
    this.toggleHomeCourt('left');
    for (const key in this.todaysGames) {
      let ele = this.todaysGames[key];
      homeTeam = this.teamsList.filter((team: any) => team.Key.toLowerCase().includes(ele.HomeTeam.toLowerCase()))[0]
      awayTeam = this.teamsList.filter((team: any) => team.Key.toLowerCase().includes(ele.AwayTeam.toLowerCase()))[0]
      if(homeTeam) homeTeam = this.statsData.filter((tm: any) => tm.team.toLowerCase().includes(homeTeam.School.split(" ")[0].toLowerCase()))[0]
      if(awayTeam) awayTeam = this.statsData.filter((tm: any) => tm.team.toLowerCase().includes(awayTeam.School.split(" ")[0].toLowerCase()))[0]
      if(homeTeam && awayTeam) {
        gameTime = ele.DateTime;
        todaysMatchups.push([homeTeam, awayTeam, gameTime])
      }
    }

    if (todaysMatchups.length > 0) {
      for (const matchup of todaysMatchups) {
        this.firstTeam = matchup[0];
        this.secondTeam = matchup[1];

        this.calculateOdds();
        this.addMatchup(matchup[2]);
      }
    } else {
      this._alertService.info("No Games were found.");
    }
    
    this.leftWinner = false;
    this.rightWinner = false;
    this.spread = '';
    this.confidenceScore = '';
  }

  addMatchup(gameTime: any) {
    if(!this.firstTeam || !this.secondTeam)  return
    var matchup = {
      "leftTeam": this.firstTeam.team,
      "leftScore": this.leftScore,
      "spread": this.winner.team + " " + this.spread,
      "totalPoints": this.totalPoints,
      "rightScore": this.rightScore,
      "rightTeam": this.secondTeam.team,
      "confidence": this.confidenceScore + "%",
      "gameTime": "User Generated",
      "remove": ""
    };

    if(gameTime) {
      matchup.gameTime = gameTime;
    }

    var res = this.gridApi.updateRowData({ add: [matchup] });
  }

  clearAllGames() {
    this.selectedAwayInfo = null;
    this.selectedAwayTeam = '';
    this.selectedAwayTeamInjuries = [];
    this.selectedAwayTeamStats = null;
    
    this.selectedHomeInfo = null;
    this.selectedHomeTeam = '';
    this.selectedHomeTeamInjuries = [];
    this.selectedHomeTeamStats = null;

    this.spread = '';
    this.confidenceScore = '';
    this.leftWinner = false;
    this.rightWinner = false;
    this.matchups = [];
  }

  toggleHomeCourt(side: any){
    if(side === "left") {
      if(!this.firstHome) {
        jQuery("#homeLeft").toggleClass("home-icon-color");
        this.firstHome = true;
        if(!this.neutral) {
          jQuery("#homeRight").toggleClass("home-icon-color");
        }
        this.secondHome = false;
        this.neutral = false;

        this.calculateOdds();
      } else if(this.firstHome) {
        jQuery("#homeLeft").toggleClass("home-icon-color");
        this.firstHome = false;
        this.neutral = true;

        this.calculateOdds();
      }
    } else if(side === "right") {
      if(!this.secondHome) {
        jQuery("#homeRight").toggleClass("home-icon-color");
        this.secondHome = true;
        if(!this.neutral) {
          jQuery("#homeLeft").toggleClass("home-icon-color");
        }
        this.neutral = false;
        this.firstHome = false;

        this.calculateOdds();
      } else if(this.secondHome) {
        jQuery("#homeRight").toggleClass("home-icon-color");
        this.secondHome = false;
        this.neutral = true;

        this.calculateOdds();
      }
    }
  }

  calculateAverages() {
    let avgPosSum = 0;
    let avgOffSum = 0;
    for (const key in this.statsData) {
      let ele = this.statsData[key];
      if (ele.team != "Team") {
        avgPosSum += Number(ele.adjT);
        avgOffSum += Number(ele.adjO);
      }
    }

    this.avgPos = avgPosSum / this.statsData.length;
    this.avgOff = avgOffSum / this.statsData.length;
  }

  calculateOdds() {
    if (this.firstTeam && this.secondTeam) {
      var awayTeam, homeTeam;
      var adv = .010;
      if (this.firstHome || this.neutral) {
        homeTeam = this.firstTeam;
        awayTeam = this.secondTeam;
      } else if (this.secondHome) {
        homeTeam = this.secondTeam;
        awayTeam = this.firstTeam;
      }

      var adjHomeOff = Number(homeTeam.adjO)
      var adjHomeDef = Number(homeTeam.adjD)

      var adjAwayOff = Number(awayTeam.adjO)
      var adjAwayDef = Number(awayTeam.adjD)

      var pythExp = 10.25;
      var adjHomePyth = Math.pow(adjHomeOff, pythExp) / (Math.pow(adjHomeOff, pythExp) + Math.pow(adjHomeDef, pythExp));
      var adjAwayPyth = Math.pow(adjAwayOff, pythExp) / (Math.pow(adjAwayOff, pythExp) + Math.pow(adjAwayDef, pythExp));

      var homeWinChance = (adjHomePyth - adjHomePyth * adjAwayPyth) / (adjHomePyth + adjAwayPyth - 2 * adjHomePyth * adjAwayPyth);
      this.homeWinChance = homeWinChance * 100;
      this.awayWinChance = (1 - homeWinChance) * 100;
      this.homeWinChance = this.homeWinChance.toFixed(0);
      this.awayWinChance = this.awayWinChance.toFixed(0);

      var adjPos = ((awayTeam.adjT / this.avgPos) * (homeTeam.adjT / this.avgPos)) * this.avgPos;

      var awayScoreDecimal = (((adjAwayOff / this.avgOff) * (adjHomeDef / this.avgOff)) * (this.avgOff) * (adjPos / 100));
      this.awayScore = Number(awayScoreDecimal.toFixed(0));
      var homeScoreDecimal = (((adjHomeOff / this.avgOff) * (adjAwayDef / this.avgOff)) * (this.avgOff) * (adjPos / 100));

      if(!this.neutral) {	
        homeScoreDecimal = homeScoreDecimal + 3.2;	
      }
      
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

      if (this.firstHome || this.neutral) {
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

function dateFormatter(params: any) {
  if(params.data.gameTime === "User Generated") return "User Generated"
  var dateAsString = params.data.gameTime;
  return `${new Date(params.data.gameTime).toDateString()} ${new Date(params.data.gameTime).toLocaleTimeString()}`;
}