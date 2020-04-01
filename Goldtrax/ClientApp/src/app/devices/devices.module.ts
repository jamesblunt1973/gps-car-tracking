import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';

const routes: Routes = [
    {
        path: 'list', component: ListComponent,
    },
    {
        path: 'new', component: NewComponent
    },
    {
        path: '', pathMatch: 'full', redirectTo: '/list'
    }
];

@NgModule({
    declarations: [ListComponent, NewComponent],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
  ]
})
export class DevicesModule { }
