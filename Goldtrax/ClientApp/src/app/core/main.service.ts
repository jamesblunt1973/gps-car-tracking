import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import { IGpsLog } from '../shared/models/gps-log.model';
import { IUserDevice } from '../shared/models/user-device.model';
import { IUser } from '../shared/models/user.model';

@Injectable()
export class MainService {

  constructor(private http: HttpClient) { }

  private reportData: Array<IGpsLog> = [];

  get ReportData() {
    return this.reportData;
  }

  set ReportData(value) {
    this.reportData = value;
  }

  checkImei(imei: string) {
    return this.http.get(environment.apiUrl + 'devices/checkImei/' + imei);
  }

  getUserDevices() {
    return this.http.get<IUserDevice[]>(environment.apiUrl + 'devices');
  }

  deleteUserDevice(id: number) {
    return this.http.delete(environment.apiUrl + 'devices/' + id);
  }

  getDeviceLog(model) {
    return this.http.post<IGpsLog[]>(environment.apiUrl + 'devices/log', model);
  }

  getUsers() {
    return this.http.get<IUser[]>(environment.apiUrl + 'users');
  }

  getUserOwnerDevices(id: number) {
    return this.http.get<number[]>(environment.apiUrl + 'users/devices/' + id);
  }
}
