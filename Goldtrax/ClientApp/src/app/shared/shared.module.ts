import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { MaterialModule } from './material.module';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';


@NgModule({
    declarations: [
        ConfirmDialogComponent,
        AlertDialogComponent],
    imports: [
        CommonModule,
        FlexLayoutModule,
        MaterialModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        FlexLayoutModule,
        ConfirmDialogComponent,
        AlertDialogComponent,
        NgxMaterialTimepickerModule
    ],
    entryComponents: [
        ConfirmDialogComponent,
        AlertDialogComponent
    ]
})
export class SharedModule { }
