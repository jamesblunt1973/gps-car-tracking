import { Component, OnInit } from '@angular/core';
import { MainService } from '../../core/main.service';
import { UiService } from '../../core/ui.service';
import { AutoUnsubscribe } from '../../shared/auto-unsubscribe';
import { Subscription } from 'rxjs';

@AutoUnsubscribe
@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

  subscriptions: Subscription[] = [];
  imei = '';

  constructor(
    private mainService: MainService,
    private uiService: UiService) { }

  ngOnInit() {
  }

  checkImei() {
    let sub = this.mainService.checkImei(this.imei).subscribe(() => {
      this.imei = '';
      // this.router.navigate(['/home'])
      this.uiService.showSuccessSnack('دستگاه مورد نظر با موفقیت ثبت شد');
    }, error => {
        switch (error.status) {
          case 400:
            this.uiService.showErrorSnack('خطای احراز هویت');
            break;
          case 401:
            this.uiService.showErrorSnack('این دستگاه قبلا ثبت شده است');
            break;
          case 404:
            this.uiService.showErrorSnack('دستگاه در سامانه ثبت نشده است');
            break;
          default:
        };
    });
    this.subscriptions.push(sub);
  }

}
