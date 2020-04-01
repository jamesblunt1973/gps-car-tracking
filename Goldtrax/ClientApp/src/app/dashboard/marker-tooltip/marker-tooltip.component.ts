import { Component, Input } from '@angular/core';
import { IMarkerTooltipData } from '../map.models';

@Component({
    selector: 'html-marker',
    templateUrl: 'marker-tooltip.component.html'
})
export class HTMLMarkerComponent {
    @Input() data: IMarkerTooltipData;
}
