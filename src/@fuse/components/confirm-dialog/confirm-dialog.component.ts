import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';
import { ContactService } from 'app/_services';

@Component({
    selector   : 'fuse-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls  : ['./confirm-dialog.component.scss']
})
export class FuseConfirmDialogComponent
{
    public confirmMessage: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<FuseConfirmDialogComponent>} dialogRef
     */
    constructor(
        public dialogRef: MatDialogRef<FuseConfirmDialogComponent>,public _getContact: ContactService,
         @Inject(MAT_DIALOG_DATA) public _data: any
    )
    {
       
    }

    delete(){
        let getContactGuId = localStorage.getItem('contactGuid');
        let abc = {
            FormAction: "delete",
            CONTACTGUID: getContactGuId
        }

        this._getContact.deleteContact(abc);  
        this.dialogRef.close(false);
        
    }

}
