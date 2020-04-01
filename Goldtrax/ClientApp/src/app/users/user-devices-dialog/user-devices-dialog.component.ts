import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IUserDevicesDialogData } from '../user-devices-dialog-data';

@Component({
  selector: 'app-user-devices-dialog',
  templateUrl: './user-devices-dialog.component.html',
  styleUrls: ['./user-devices-dialog.component.scss']
})
export class UserDevicesDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UserDevicesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IUserDevicesDialogData) { }

  devices = [];

  ngOnInit(): void {
    for (let dev of this.data.ownerDevices) {

      if (!dev.owner)
        continue;

      let device = {
        ...dev.device,
        selected: false
      };

      for (let i in this.data.userDeviceIds) {
        let id = this.data.userDeviceIds[i];
        if (dev.device.id === id) {
          device.selected = true;
          break;
        }
      }

      this.devices.push(device);
    }
  }
}
