import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainService } from '../../core/main.service';
import { UiService } from '../../core/ui.service';
import { AutoUnsubscribe } from '../../shared/auto-unsubscribe';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { IDevice } from '../../shared/models/device.model';

@AutoUnsubscribe
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  subscriptions: Subscription[] = [];
  devices: IDevice[] = [];

  constructor(
    private mainService: MainService,
    private dialog: MatDialog,
    private uiService: UiService,
    private router: Router
  ) { }

  ngOnInit() {
    let sub = this.mainService.getUserDevices().subscribe(res => {
      this.devices = res.filter(a => a.owner).map(a => a.device);
    });
    this.subscriptions.push(sub);
  }

  deleteDevice(device: IDevice) {
    device.busy = true;
    if (this.devices.length == 1) {
      this.uiService.showWarningSnack('درصورت حذف این دستگاه، امکان استفاده از سامانه برای شما وجود نخواهد داشت');
      window.setTimeout(() => this.deleteUserDevice(device), 2000);
    }
    else
      this.deleteUserDevice(device);
  }

  private deleteUserDevice(device: IDevice) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title: '',
        message: 'دستگاه مورد نظر حذف شود؟',
        okText: 'بله',
        cancelText: 'خیر'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      device.busy = false;
      if (result) {
        let sub = this.mainService.deleteUserDevice(device.id).subscribe(() => {
          var index = this.devices.findIndex(a => a.id == device.id);
          this.devices.splice(index, 1);
          this.uiService.showSuccessSnack('دستگاه مورد نظر شما با موفقیت حذف شد');
          if (this.devices.length == 0)
            this.router.navigate(['/devices/new']);
        }, error => {
          this.dialog.open(AlertDialogComponent, {
            width: '300px',
            maxWidth: '600px',
            data: {
              icon: 'errorIcon',
              message: JSON.stringify(error.errors),
              title: 'خطا به هنگام حذف دستگاه',
              iconColor: '#c00'
            }
          });
        });
        this.subscriptions.push(sub);
      }
    });
  }

}
