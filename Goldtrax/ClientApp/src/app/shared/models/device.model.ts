export interface IDevice {
  id: number,
  imei: string,
  production: boolean,
  lastConnection: Date,
  busy?: boolean
}
