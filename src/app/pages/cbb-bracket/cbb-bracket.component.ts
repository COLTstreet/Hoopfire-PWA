import { Component, OnInit } from '@angular/core';

declare var jQuery: any;

@Component({
  selector: 'app-cbb-bracket',
  templateUrl: './cbb-bracket.component.html',
  styleUrls: ['./cbb-bracket.component.scss']
})
export class CbbBracketComponent implements OnInit {

  constructor() { }

  //Variables
  selected: any;
  currentNav: any;
  cbbTeams: any;
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
  dataLoading = false;
  firstHome = true;
  secondHome = false;
  neutral = false;

  ngOnInit() {
    this.getCbbData();
  }

  getCbbData() {
    //CBB Data Call
    let scope = this;
    this.dataLoading = true;
    jQuery.ajax({
      url: "https://firestore.googleapis.com/v1beta1/projects/hoopfire-api/databases/(default)/documents/college-teams?pageSize=400&key=a9d366bac3abc2f55bca7a4fa84512befed452f2",
      dataType: "jsonp",
      success: function (parsed_json) {
        scope.cbbTeams = parsed_json.documents;
        if (parsed_json.nextPageToken) {
          //NCAA Data Call
          jQuery.ajax({
            url: "https://firestore.googleapis.com/v1beta1/projects/hoopfire-api/databases/(default)/documents/college-teams?pageSize=100&key=a9d366bac3abc2f55bca7a4fa84512befed452f2&pageToken=" + parsed_json.nextPageToken,
            dataType: "jsonp",
            success: function (parsed_json) {
              scope.cbbTeams = scope.cbbTeams.concat(parsed_json.documents);
              scope.calculateAverages();
              scope.dataLoading = false;
            }
          });
        }
      },
      error: function (err) {
        console.log(err);
      }
    });
  }

  calculateAverages() {
    let scope = this;
    let avgPosSum = 0;
    let avgOffSum = 0;
    scope.cbbTeams.forEach(function (element) {
      if (element.fields.team.stringValue != "Team") {
        avgPosSum += Number(element.fields.adjT.stringValue);
        avgOffSum += Number(element.fields.adjO.stringValue);
      }
    });

    this.avgPos = avgPosSum / this.cbbTeams.length;
    this.avgOff = avgOffSum / this.cbbTeams.length;
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

      var adjHomeOff = Number(homeTeam.fields.adjO.stringValue);
      var adjHomeDef = Number(homeTeam.fields.adjD.stringValue);

      var adjAwayOff = Number(awayTeam.fields.adjO.stringValue);
      var adjAwayDef = Number(awayTeam.fields.adjD.stringValue);

      var pythExp = 10.25;
      var adjHomePyth = Math.pow(adjHomeOff, pythExp) / (Math.pow(adjHomeOff, pythExp) + Math.pow(adjHomeDef, pythExp));
      var adjAwayPyth = Math.pow(adjAwayOff, pythExp) / (Math.pow(adjAwayOff, pythExp) + Math.pow(adjAwayDef, pythExp));

      var homeWinChance = (adjHomePyth - adjHomePyth * adjAwayPyth) / (adjHomePyth + adjAwayPyth - 2 * adjHomePyth * adjAwayPyth);
      this.homeWinChance = homeWinChance * 100;
      this.awayWinChance = (1 - homeWinChance) * 100;
      this.homeWinChance = this.homeWinChance.toFixed(0);
      this.awayWinChance = this.awayWinChance.toFixed(0);

      var adjPos = ((awayTeam.fields.adjT.stringValue / this.avgPos) * (homeTeam.fields.adjT.stringValue / this.avgPos)) * this.avgPos;

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
