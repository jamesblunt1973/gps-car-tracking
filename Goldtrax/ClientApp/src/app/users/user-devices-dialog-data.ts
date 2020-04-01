import { IUser } from '../shared/models/user.model';
import { IUserDevice } from '../shared/models/user-device.model';

export interface IUserDevicesDialogData {
  user: IUser,
  ownerDevices: IUserDevice[]
  userDeviceIds: number[]
}
