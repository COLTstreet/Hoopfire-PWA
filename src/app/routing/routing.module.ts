import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NbaComponent } from '../pages/nba/nba.component';
import { CbbComponent } from '../pages/cbb/cbb.component';
import { CbbBracketComponent } from '../pages/cbb-bracket/cbb-bracket.component';

    const routes: Routes = [
      { path: '', redirectTo: 'nba', pathMatch: 'full' },
      { path: 'nba', component: NbaComponent},
      { path: 'cbb', component: CbbComponent},
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
