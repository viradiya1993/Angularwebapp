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
    ConBtn: string;
    btnName: string;
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
        console.log(_data);
        if(_data == null){
            this.ConBtn='Show';
            this.btnName='Cancel'
            this.confirmData = _data;
        }else if(_data.errorData){
            this.ConBtn='Hide';
            this.btnName='Ok'
            this.confirmData = _data.errorData; 
        }else{
            this.ConBtn='Show';
            this.btnName='Cancel'
            this.confirmData = _data; 
        }
        // let item = localStorage.getItem('confEWshow');
        // if (item =='error') {
        //     this.ShowHide="Hide"
        //     console.log(item);
        // }else{
        //     this.ShowHide=""
        // }
  
        
    }

}
