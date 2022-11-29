import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { DataService } from './services/data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';

import { AngularFireModule } from "@angular/fire/compat";
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { NbaComponent } from './pages/nba/nba.component';
import { NcaaMenComponent } from './pages/ncaa-men/ncaa-men.component';
import { ToolbarComponent } from './common/toolbar/toolbar.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NbaComponent,
    NcaaMenComponent,
    ToolbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    MaterialModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyAfk_lmxCyyKEMfgpOxSbodP3a1U09SCN0",
      authDomain: "hoopfire-api.firebaseapp.com",
      databaseURL: "https://hoopfire-api.firebaseio.com",
      projectId: "hoopfire-api",
      storageBucket: "hoopfire-api.appspot.com",
      messagingSenderId: "268925296487",
      appId: "1:268925296487:web:cd5ecc971296e4533399c2"
    }),
    AngularFirestoreModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
