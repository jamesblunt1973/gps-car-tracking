import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';

import { UiService } from '../../core/ui.service';

@Component({
    selector: 'app-container',
    templateUrl: './container.component.html',
    styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit, OnDestroy {

    watcher: Subscription;
    activeMediaQuery = '';
    small = false;

    constructor(private uiService: UiService, mediaObserver: MediaObserver) {
        const mobileSize = ['sm', 'xs'];
        this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
            this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
            this.small = mobileSize.indexOf(change.mqAlias) > -1;
        });
    }

    sidebarStatus = false;

    ngOnInit() {
        this.uiService.getMessage().subscribe(status => {
            this.sidebarStatus = status === 'open'
        });
    }

    onSidebarClosing() {
        this.uiService.changeSidebarStatus();
    }

    ngOnDestroy() {
        this.watcher.unsubscribe();
    }

}
