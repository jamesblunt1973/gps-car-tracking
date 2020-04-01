import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    animations: [trigger('slideUp', [
        transition(':enter', [
            style({ opacity: 0 }),
            animate('0.3s ease-out',
                style({
                    opacity: 1,
                    transform: 'translateX(0px)'
                })),
        ]),
        transition(':leave', [
            style({ opacity: 1 }),
            animate('0.3s ease',
                style({
                    opacity: 0,
                    transform: 'translateX(-180px)'
                })),
        ]),
    ])]
})
export class FooterComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }

}
