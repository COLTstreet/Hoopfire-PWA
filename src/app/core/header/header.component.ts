import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  page = "nba";

  ngOnInit() {
    if(window.location.pathname === "/cbb") {
      this.page = "ncaa";
    } else if(window.location.pathname === "/cbb-bracket") {
      this.page = "final-four";
    }
  }

}
