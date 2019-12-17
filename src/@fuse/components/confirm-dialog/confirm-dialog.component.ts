import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BehaviorService } from 'app/_services';

@Component({
    selector: 'fuse-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class FuseConfirmDialogComponent {
    public confirmMessage: string = "Are you sure you want to Save?";
    public confirmData: any;
    ShowHide: string;
    /**
     * Constructor
     *
     * @param {MatDialogRef<FuseConfirmDialogComponent>} dialogRef
     */
    constructor(
        public dialogRef: MatDialogRef<FuseConfirmDialogComponent>,
        private behaviorService: BehaviorService,
        @Inject(MAT_DIALOG_DATA) public _data: any
    ) {
        let item = localStorage.getItem('confEWshow');
        if (item =='error') {
            this.ShowHide="Hide"
            console.log(item);
        }else{
            this.ShowHide="Show"
        }
  
        this.confirmData = _data;
    }

}
