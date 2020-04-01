export interface IGpsLog {
    id: number,
    deviceId: number,
    speed: number,
    direction: number,
    dateTime: Date,
    kilometer: number,
    satellite: number,
    hdop: number,
    latitude: number,
    longitude: number,
    altitude: number
}