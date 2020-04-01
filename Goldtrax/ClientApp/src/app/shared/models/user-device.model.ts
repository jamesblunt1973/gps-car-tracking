import { IDevice } from './device.model';
import { IGpsLog } from './gps-log.model';

export interface IUserDevice { // UserDeviceResult
    device: IDevice,
    gpsLog: IGpsLog,
    owner: boolean
}
