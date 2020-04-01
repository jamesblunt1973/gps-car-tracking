import { LatLng } from 'leaflet';

export interface IMarkerTooltipData {
    name: string;
    description: string
}

export interface IMapOption {
    layers: Array<any>,
    zoom: number,
    center: LatLng
}