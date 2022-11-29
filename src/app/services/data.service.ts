import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public isOnline = false
  public modalVersion = false

  constructor() { }
}
