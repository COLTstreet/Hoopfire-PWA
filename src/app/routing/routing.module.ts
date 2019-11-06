import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NbaComponent } from '../pages/nba/nba.component';
import { CbbComponent } from '../pages/cbb/cbb.component';
import { CbbBracketComponent } from '../pages/cbb-bracket/cbb-bracket.component';
import { WcbbComponent } from '../pages/wcbb/wcbb.component';

    const routes: Routes = [
      { path: '', redirectTo: 'nba', pathMatch: 'full' },
      { path: 'nba', component: NbaComponent},
      { path: 'cbb', component: CbbComponent},
      { path: 'wcbb', component: WcbbComponent},
      { path: 'cbb-bracket', component: CbbBracketComponent}
    ];

    @NgModule({
        imports: [
            RouterModule.forRoot(routes)
        ],
        exports: [
            RouterModule
        ],
        declarations: []
    })
    export class RoutingModule { }
