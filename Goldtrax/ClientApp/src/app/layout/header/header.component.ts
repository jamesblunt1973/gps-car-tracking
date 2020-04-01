import { Component, OnInit } from '@angular/core';

import { UiService } from '../../core/ui.service';
import { AuthService } from '../../core/auth.service';
import { IUser } from '../../shared/models/user.model';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    menuStatus = '';
    user: IUser = null;

    constructor(private uiService: UiService, private authService: AuthService) { }

    ngOnInit() {
        this.uiService.getMessage().subscribe(status => {
            this.menuStatus = status;
        });
        this.authService.userStatus().subscribe(res => {
            this.user = res;
        });
    }

    changeMenuBtn() {
        this.uiService.changeSidebarStatus();
    }

    logout() {
        this.authService.logout();
    }

    showPathConfig() {

    }
}
