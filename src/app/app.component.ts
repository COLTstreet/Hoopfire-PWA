import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Platform } from '@angular/cdk/platform';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, map } from 'rxjs/operators';
import { DataService } from './services/data.service';

declare const gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  modalPwaEvent: any;
  modalPwaPlatform: string|undefined;

  constructor(private platform: Platform,
              private swUpdate: SwUpdate,
              public router: Router,
              public _dataService: DataService) {
    this._dataService.isOnline = false;
    this._dataService.modalVersion = false;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-1MM9P0LK0F', { 'page_path': event.urlAfterRedirects });
      }      
    })
  }

  public ngOnInit(): void {
    this.updateOnlineStatus();

    window.addEventListener('online',  this.updateOnlineStatus.bind(this));
    window.addEventListener('offline', this.updateOnlineStatus.bind(this));

    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.pipe(
        filter((evt: any): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        map((evt: any) => {
          // console.info(`currentVersion=[${evt.currentVersion} | latestVersion=[${evt.latestVersion}]`);
          this._dataService.modalVersion = true;
        }),
      );
    }

    this.loadModalPwa();
  }

  private updateOnlineStatus(): void {
    this._dataService.isOnline = window.navigator.onLine;
    // console.info(`isOnline=[${this.isOnline}]`);
  }

  public updateVersion(): void {
    this._dataService.modalVersion = false;
    window.location.reload();
  }

  public closeVersion(): void {
    this._dataService.modalVersion = false;
  }

  private loadModalPwa(): void {
    if (this.platform.ANDROID) {
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event.preventDefault();
        this.modalPwaEvent = event;
        this.modalPwaPlatform = 'ANDROID';
      });
    }

    if (this.platform.IOS && this.platform.SAFARI) {
      const isInStandaloneMode = ('standalone' in window.navigator) && ((<any>window.navigator)['standalone']);
      if (!isInStandaloneMode) {
        this.modalPwaPlatform = 'IOS';
      }
    }
  }

  public addToHomeScreen(): void {
    this.modalPwaEvent.prompt();
    this.modalPwaPlatform = undefined;
  }

  public closePwa(): void {
    this.modalPwaPlatform = undefined;
  }

}