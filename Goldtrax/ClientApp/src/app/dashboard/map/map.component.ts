import { Component, ComponentFactoryResolver, Injector, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as signalR from '@aspnet/signalr';
import { featureGroup, icon, IconOptions, latLng, LatLng, LatLngBounds, Layer, marker, Marker, point, polyline, tileLayer } from 'leaflet';
import 'leaflet-rotatedmarker';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth.service';
import { MainService } from '../../core/main.service';
import { AutoUnsubscribe } from '../../shared/auto-unsubscribe';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';
import { AlertDialogData } from '../../shared/models/alert-dialog-data.model';
import { IUserDevice } from '../../shared/models/user-device.model';
import { IMapOption } from '../map.models';
import { HTMLMarkerComponent } from '../marker-tooltip/marker-tooltip.component';

@AutoUnsubscribe
@Component({
  selector: 'app-map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  userDevices: IUserDevice[] = [];

  center: LatLng = latLng([0, 0]);
  markers: Marker[] = [];
  layers: Layer[] = [];
  bounds: LatLngBounds;
  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true
  });
  options: IMapOption = {
    layers: [this.streetMaps],
    zoom: 15,
    center: this.center
  };

  icons: IconOptions[] = [];
  markerIcon: IconOptions;
  markerIndex = 0;

  private radianCoef = 180 / Math.PI;

  connection: signalR.HubConnection;
  //showPath = false;

  constructor(private mainService: MainService,
    private authService: AuthService,
    private router: Router,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private dialog: MatDialog) {

    this.icons.push({
      iconSize: [50, 23],
      iconAnchor: [25, 12],
      iconUrl: 'assets/images/car.png'
    });

    this.icons.push({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: 'leaflet/marker-icon.png',
      shadowUrl: 'leaflet/marker-shadow.png'
    });
    this.markerIcon = this.icons[this.markerIndex];
  }

  ngOnInit() {
    //this.showPath = false;
    //var path = this.mainService.Route;
    //if (path.length > 1) { // atleast 2 point
    //  this.showRoute(path);
    //  this.showPath = true;
    //  this.mainService.Route = [];
    //  return;
    //}
    this.layers = [];
    let sub = this.mainService.getUserDevices().subscribe(res => {
      if (res == null || res.length === 0) {
        let alertData: AlertDialogData = {
          icon: 'close-octagon',
          iconColor: '#b71c1c',
          message: 'هیچ دستگاهی به نام شما یافت نشد!',
          title: 'خطا'
        };
        let dialogRef = this.dialog.open(AlertDialogComponent, {
          width: '270px',
          data: alertData
        });
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['/devices/new']);
        });
      }
      else {
        this.userDevices = res;
        this.initMap();
      }
    });
    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected)
      this.connection.stop();
  }

  initMap() {
    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(environment.signalR)
      .build();

    let user = this.authService.User;
    let deviceIds = this.userDevices.map(a => a.device.id.toString());

    this.setMarkers();
    let filtered = this.markers.filter(a => a !== undefined);
    this.bounds = featureGroup(filtered).getBounds();


    this.connection.start().then(() => {
      console.log('Connected!');
      this.connection.invoke('ConnectUser', user.id, deviceIds);
    }).catch(function (err) {
      return console.error(err.toString());
    });
    this.connection.on("NewPosition", (id: number, lat: number, lng: number) => {
      let marker = this.markers[id];
      marker.setLatLng(latLng([lat, lng]));
      // marker.options.rotationAngle = dir * this.radianCoef;
    });
  }

  showRoute(points: LatLng[]) {
    let start = marker(points[0], {
      icon: icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        iconUrl: 'assets/marker-icon.png',
        shadowUrl: 'assets/marker-shadow.png'
      })
    });
    let end = marker(points[points.length - 1], {
      icon: icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        iconUrl: 'assets/marker-icon.png',
        shadowUrl: 'assets/marker-shadow.png'
      })
    });
    let route = polyline(points);
    //this.options.layers = [this.streetMaps, route, start, end];
    this.layers = [route, start, end];
    this.bounds = route.getBounds(), {
      padding: point(24, 24),
      maxZoom: 12,
      animate: true
    };
  }

  setMarkers() {
    this.markers = [];
    for (let userDevice of this.userDevices) {
      this.markers[userDevice.device.id] = this.createMarker(userDevice);
    }
  }

  createMarker(ud: IUserDevice) {
    // get position
    let position = latLng(ud.gpsLog.latitude, ud.gpsLog.longitude);

    // dynamically instantiate a HTMLMarkerComponent
    const factory = this.resolver.resolveComponentFactory(HTMLMarkerComponent);

    // we need to pass in the dependency injector
    const component = factory.create(this.injector);

    // wire up the @Input() or plain variables (doesn't have to be strictly an @Input())
    component.instance.data = {
      description: 'تست توضیحات',
      name: 'نام دستگاه'
    };

    // we need to manually trigger change detection on our in-memory component
    // s.t. its template syncs with the data we passed in
    component.changeDetectorRef.detectChanges();

    const newMarker = marker(
      position,
      {
        // rotationAngle: ud.gpsLog.direction * this.radianCoef,
        icon: icon(this.markerIcon) //, clickable: true
      }
    )/*.on('click', a => {
            this.zone.run(() => {
                this.router.navigate(['/events/' + id]);
            });
        })*/;

    // pass in the HTML from our dynamic component
    const popupContent = component.location.nativeElement;

    // add popup functionality
    newMarker.bindPopup(popupContent).openPopup();

    return newMarker;
  }

  changeMap(e) {
    let zoom = e.target._zoom;
    let index: number;
    if (zoom < 15)
      index = 1;
    else
      index = 0;

    if (this.markerIndex != index) {
      this.markerIndex = index;
      this.markerIcon = this.icons[index];
      // this.setMarkers();
      this.markers.map(a => {
        // a.options.rotationAngle = 0;
        a.setIcon(icon(this.markerIcon));
      });
    }
  }
}
