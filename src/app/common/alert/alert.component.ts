import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { Alert, AlertType } from './alert.model';

@Component({ selector: 'alert', templateUrl: 'alert.component.html' })
export class AlertComponent implements OnInit, OnDestroy {
    @Input() id!: string;

    alerts: Alert[] = [];
    subscription!: Subscription;

    constructor(public alertService: AlertService) { }

    ngOnInit() {
        this.subscription = this.alertService.onAlert(this.id)
            .subscribe(alert => {
                if (!alert.message) {
                    // clear alerts when an empty alert is received
                    this.alerts = [];
                    return;
                }

                // add alert to array
                this.alerts.push(alert);
                let svc = this;
                setTimeout(function() { 
                    svc.removeAlert(alert);
                }, 3000);
            });
    }

    ngOnDestroy() {
        // unsubscribe to avoid memory leaks
        this.subscription.unsubscribe();
    }

    removeAlert(alert: Alert) {
        // remove specified alert from array
        this.alerts = this.alerts.filter(x => x !== alert);
    }

    cssClass(alert: Alert) {
        if (!alert) {
            return;
        }

        // return css class based on alert type
        switch (alert.type) {
            case AlertType.Success:
                return 'alert alert-success';
            case AlertType.Error:
                return 'alert alert-danger';
            case AlertType.Info:
                return 'alert alert-info';
            case AlertType.Warning:
                return 'alert alert-warning';
        }
    }
}