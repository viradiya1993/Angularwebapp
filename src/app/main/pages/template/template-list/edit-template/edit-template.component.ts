import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService } from 'app/_services';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FormatVariableComponent } from './insert-with-formating/format-variable.component';
import { NewFieldComponent } from './new-field/new-field.component';


@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.scss'],
  animations: fuseAnimations
})
export class EditTemplateComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  @Input() errorWarningData: any;
 
  addData:any=[];
  btnClick: string;
  constructor(private _mainAPiServiceService:MainAPiServiceService, public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<EditTemplateComponent>) { }

  ngOnInit() {
    this.btnClick='EditTemplate';
    // this._mainAPiServiceService.getSetData({}, 'GetSystem').subscribe(response=>{
    //  // console.log(response);
    //   this.addData=response.DATA.SYSTEM.ADDRESSGROUP.POSTALADDRESSGROUP
    // })
    
  }
  InsertWithForm(){
  
      const dialogRef = this._matDialog.open(FormatVariableComponent, { width: '100%', disableClose: true, });
      dialogRef.afterClosed().subscribe(result => {
          if (result) {
              // localStorage.setItem('set_active_matters', JSON.stringify(result));
          }
      });
 
  }
  EditUser(){
  this.btnClick='EditUser';

  }
  EditTemplate(){
    this.btnClick='EditTemplate';
  }
  NewAddField(){
    const dialogRef = this._matDialog.open(NewFieldComponent, { width: '100%', disableClose: true, });
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
            // localStorage.setItem('set_active_matters', JSON.stringify(result));
        }
    });
  }
  closepopup(){
    this.dialogRef.close(false);
  }



}
