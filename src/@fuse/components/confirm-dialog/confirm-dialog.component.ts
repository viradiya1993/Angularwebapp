import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'fuse-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class FuseConfirmDialogComponent {
    public confirmMessage: string = "Are you sure you want to Save?";
    public confirmData: any;
    /**
     * Constructor
     *
     * @param {MatDialogRef<FuseConfirmDialogComponent>} dialogRef
     */
    constructor(
        public dialogRef: MatDialogRef<FuseConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public _data: any
    ) {
        this.confirmData = _data;
    }

}
