import { Component } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainService } from '../../core/main.service';
import { UiService } from '../../core/ui.service';
import { AutoUnsubscribe } from '../../shared/auto-unsubscribe';
import { IDevice } from '../../shared/models/device.model';

@AutoUnsubscribe
@Component({
  selector: 'app-report-config',
  templateUrl: 'config.component.html',
  styleUrls: ['config.component.scss']
})
export class ConfigComponent {

  subscriptions: Subscription[] = [];

  hours = 1;
  devices: IDevice[] = [];

  deviceId = 0;
  date1 = new Date();
  time1 = '12:00 AM';
  date2 = new Date();
  time2 = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

  constructor(private router: Router,
    private route: ActivatedRoute,
    private mainService: MainService,
    private uiService: UiService) { }

  ngOnInit() {
    this.mainService.getUserDevices().subscribe(res => {
      if (res.length > 0) {
        this.devices = res.map(a => a.device);
        this.deviceId = this.devices[0].id;
      }
    });
  }

  getRouteHours() {
    var now = new Date();
    now.setHours(now.getHours() - this.hours)
    const model = {
      deviceId: this.deviceId,
      from: now,
      to: new Date()
    };
    this.showRoute(model);
  }

  getRouteDates() {
    let fromDate = this.date1;
    if (!(fromDate instanceof Date))
      fromDate = new Date(fromDate);

    let toDate = this.date2;
    if (!(toDate instanceof Date))
      toDate = new Date(toDate);

    let d1 = fromDate.toDateString() + ' ' + this.time1;
    let d2 = toDate.toDateString() + ' ' + this.time2;
    const model = {
      deviceId: this.deviceId,
      from: new Date(d1),
      to: new Date(d2)
    };
    this.showRoute(model);
  }

  showRoute(model) {
    let sub = this.mainService.getDeviceLog(model).subscribe(res => {
      if (res.length === 0) {
        this.uiService.showWarningSnack('هیچ موقعیتی در این بازه زمانی ثبت نشده است!');
        return;
      }
      this.mainService.ReportData = res;
      this.router.navigate(['/home'])
    });
    this.subscriptions.push(sub);
  }

}
