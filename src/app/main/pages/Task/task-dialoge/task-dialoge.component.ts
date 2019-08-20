import { Component, OnInit, Input, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService } from 'app/_services';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { MatterDialogComponent } from '../../time-entries/matter-dialog/matter-dialog.component';
@Component({
    selector: 'app-task-dialoge',
    templateUrl: './task-dialoge.component.html',
    styleUrls: ['./task-dialoge.component.scss'],
    animations: fuseAnimations
})
export class TaskDialogeComponent implements OnInit {
    @Input() errorWarningData: any;
    addData: any = [];
    TemplateName: any;
    action: any;
    title: string;
    constructor(private _mainAPiServiceService: MainAPiServiceService,
        public dialogRef: MatDialogRef<TaskDialogeComponent>, @Inject(MAT_DIALOG_DATA) public _data: any,
        private dialog: MatDialog) {
        console.log(_data);
        this.action=_data.action;

        if(this.action=='new matter'){
            this.title="New Task";
        }else if(this.action=='edit'){
            this.title="Edit Task";
        }else if(this.action=='new general'){
            this.title="New Task";
        }else if(this.action=='duplicate'){
            this.title="Duplicate Task";
        }
    }
    ngOnInit() {
        // this._mainAPiServiceService.getSetData({}, 'GetSystem').subscribe(response=>{
        //  // console.log(response);
        //   this.addData=response.DATA.SYSTEM.ADDRESSGROUP.POSTALADDRESSGROUP
        // })
    }
    closepopup() {
        this.dialogRef.close(false);
    }
    choosedDateOfBirth(val1,val2){

    }
    SelectMatter() {
        const dialogRef = this.dialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: null });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
            }
        });
    }

}
