import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
    declarations: [
        FuseConfirmDialogComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule,
        CommonModule,
        DragDropModule
    ],
    entryComponents: [
        FuseConfirmDialogComponent
    ],
})
export class FuseConfirmDialogModule {

}
