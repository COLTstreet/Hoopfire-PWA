import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from './material/material.module';
import { AgGridModule } from 'ag-grid-angular';

import { NbaComponent } from './pages/nba/nba.component';

import { RoutingModule } from './routing/routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CbbComponent } from './pages/cbb/cbb.component';
import { HeaderComponent } from './core/header/header.component';
import { CbbBracketComponent } from './pages/cbb-bracket/cbb-bracket.component';
import { WcbbComponent } from './pages/wcbb/wcbb.component';
import { ExportService } from './services/export.service';
import { WcbbBracketComponent } from './pages/wcbb-bracket/wcbb-bracket.component';

@NgModule({
  declarations: [
    AppComponent,
    NbaComponent,
    CbbComponent,
    HeaderComponent,
    CbbBracketComponent,
    WcbbComponent,
    WcbbBracketComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RoutingModule,
    MaterialModule,
    AgGridModule.withComponents([]),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [ExportService],
  bootstrap: [AppComponent]
})
export class AppModule { }
