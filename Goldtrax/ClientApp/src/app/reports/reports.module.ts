import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ConfigComponent } from './config/config.component';

const routes: Routes = [
  {
    path: '', pathMatch: 'full', component: ConfigComponent
  }
];

@NgModule({
  declarations: [ConfigComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ReportsModule { }
