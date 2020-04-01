import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MainService } from '../../core/main.service';
import { UiService } from '../../core/ui.service';
import { AutoUnsubscribe } from '../../shared/auto-unsubscribe';
import { IUserDevice } from '../../shared/models/user-device.model';
import { IUser } from '../../shared/models/user.model';
import { UserDevicesDialogComponent } from '../user-devices-dialog/user-devices-dialog.component';
import { IUserDevicesDialogData } from '../user-devices-dialog-data';

@AutoUnsubscribe
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  users: IUser[] = [];
  userDevices: IUserDevice[] = [];
  subscriptions: Subscription[] = [];
  loading = false;

  constructor(private mainService: MainService, private uiService: UiService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loading = true;
    let sub = this.mainService.getUsers().subscribe(res => {
      this.loading = false;
      this.users = res;
    });
    this.subscriptions.push(sub);
  }

  deleteUser(user: IUser) {
    console.log(user);
  }

  editUserDevices(user: IUser) {
    if (this.userDevices.length == 0) {
      let sub = this.mainService.getUserDevices().subscribe(res => {
        this.userDevices = res;
        this.showUserDevicesDialog(user);
      });
      this.subscriptions.push(sub);
    }
    else
      this.showUserDevicesDialog(user);
  }

  showUserDevicesDialog(user: IUser) {
    let sub = this.mainService.getUserOwnerDevices(user.id).subscribe(res => {
      let data: IUserDevicesDialogData = {
        ownerDevices: this.userDevices,
        userDeviceIds: res,
        user: user
      };
      this.dialog.open(UserDevicesDialogComponent, {
        data: data,
        panelClass: 'full-dialog-container'
      });
    });
    this.subscriptions.push(sub);
  }

}
