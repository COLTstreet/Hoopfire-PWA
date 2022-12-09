import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _http: HttpClient;

  public isOnline = false
  public modalVersion = false

  constructor(private  store: AngularFirestore, injector: Injector) { 
    this._http = injector.get(HttpClient);
  }

  getNBAAnalytics(): Observable<any> {
    return this.store.collection('nba-teams').snapshotChanges();
  }

  getNBATeams(): Observable<any> {
    return this.get("https://api.sportsdata.io/v3/nba/scores/json/teams", "ec152bc50abf4e5b9ca29809636371aa");
  }

  getTodaysNBASchedule() {
    let today = new Date().toDateString().split(' ');
    let date = today[3] + '-' + today[1].toUpperCase() + '-' + today[2]
    return this.get("https://api.sportsdata.io/v3/nba/scores/json/GamesByDate/" + date, "ec152bc50abf4e5b9ca29809636371aa");
  }

  getAllNBAInjuries() {
    return this.get("https://api.sportsdata.io/v3/nba/projections/json/InjuredPlayers", "ec152bc50abf4e5b9ca29809636371aa");
  }

  getAllNBATeamSeasonStats() {
    let year = new Date().getFullYear() + 1;
    return this.get("https://api.sportsdata.io/v3/nba/scores/json/TeamSeasonStats/" + year, "ec152bc50abf4e5b9ca29809636371aa");
  }

  getNCAAMAnalytics(): Observable<any> {
    return this.store.collection('college-teams').snapshotChanges();
  }

  getNCAAMTeams(): Observable<any> {
    return this.get("https://api.sportsdata.io/v3/cbb/scores/json/teams", "98e791070abc4d1fb5201776d3763e83");
  }

  getTodaysNCAAMSchedule() {
    let today = new Date().toDateString().split(' ');
    let date = today[3] + '-' + today[1].toUpperCase() + '-' + today[2]
    return this.get("https://api.sportsdata.io/v3/cbb/scores/json/GamesByDate/" + date, "98e791070abc4d1fb5201776d3763e83");
  }

  getAllNCAAMInjuries() {
    return this.get("https://api.sportsdata.io/v3/cbb/scores/json/InjuredPlayers", "98e791070abc4d1fb5201776d3763e83");
  }

  getAllNCAAMTeamSeasonStats() {
    let year = new Date().getFullYear() + 1;
    return this.get("https://api.sportsdata.io/v3/cbb/scores/json/TeamSeasonStats/" + year, "98e791070abc4d1fb5201776d3763e83");
  }
  



  protected get(cmd: string, key: any) {
    let headers = new HttpHeaders();
    // headers = headers.append("x-rapidapi-key", "e2f8226b79af2bdcd066e64fda2999ef");
    // headers = headers.append("x-rapidapi-host", "v1.basketball.api-sports.io");
    headers = headers.append("Ocp-Apim-Subscription-Key", key);
    
    //console.log(cmd)
    // return this._http.get(cmd, {headers});
    return this._http.get(cmd + "?key=" + key);
  }
}
