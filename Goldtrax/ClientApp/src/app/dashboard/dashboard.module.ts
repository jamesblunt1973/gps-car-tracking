import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { SharedModule } from '../shared/shared.module';
import { MapComponent } from './map/map.component';
import { HTMLMarkerComponent } from './marker-tooltip/marker-tooltip.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', component: MapComponent }
];

@NgModule({
    declarations: [MapComponent, HTMLMarkerComponent],
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        LeafletModule.forRoot()
    ],
    entryComponents: [HTMLMarkerComponent]
})
export class DashboardModule { }
