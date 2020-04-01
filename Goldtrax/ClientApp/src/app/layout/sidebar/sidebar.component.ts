import { Component, OnInit } from '@angular/core';

import { IMneuItem } from './menuItem.model';
import { UiService } from '../../core/ui.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

    menuItems: IMneuItem[] = [];

    constructor(private uiService: UiService) { }

    ngOnInit() {

        this.menuItems = [{
            icon: 'view-dashboard',
            title: 'داشبورد',
            url: '/home'
        }, {
            icon: 'chip',
            title: 'دستگاه‌ها',
            url: '/devices/list'
        }, {
            icon: 'plus-circle',
            title: 'ثبت دستگاه جدید',
            url: '/devices/new'
        }, {
            icon: 'traffic-light',
            title: 'گزارش تردد',
            url: '/reports'
        }, {
            icon: 'account-multiple',
            title: 'مدیریت کاربران',
            url: '/users'
        }];
    }

    collapseSidebar(item: IMneuItem) {
        this.uiService.changeSidebarStatus();
    }

}
