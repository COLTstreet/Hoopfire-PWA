import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NbaComponent } from './pages/nba/nba.component';
import { NcaaMenComponent } from './pages/ncaa-men/ncaa-men.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'nba',
    component: NbaComponent,
    pathMatch: 'full'
  },
  {
    path: 'ncaa-men',
    component: NcaaMenComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
