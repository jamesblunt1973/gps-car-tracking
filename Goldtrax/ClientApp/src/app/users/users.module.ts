import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ListComponent } from './list/list.component';
import { UserDevicesDialogComponent } from './user-devices-dialog/user-devices-dialog.component';

const routes: Routes = [
  {
    path: '', pathMatch: 'full', component: ListComponent
  }
];

@NgModule({
  declarations: [ListComponent, UserDevicesDialogComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class UsersModule { }
