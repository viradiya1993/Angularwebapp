import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activity-dialog',
  templateUrl: './activity-dialog.component.html',
  styleUrls: ['./activity-dialog.component.scss']
})
export class ActivityDialogComponent implements OnInit {
  activityForm:FormGroup;
  isLoadingResults: boolean = false;
  action: string;
  dialogTitle: string;
  isspiner: boolean = false;
  
  constructor(
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<ActivityDialogComponent>,
    private router: Router,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  )
  {
    this.action = data.action;
    if(this.action === 'new'){
      this.dialogTitle = 'New Activity';
    }else if(this.action === 'edit'){
      this.dialogTitle = 'Edit Activity';
    }else{
      this.dialogTitle = 'Duplicate Activity';
    }
  }

  ngOnInit() {
    this.activityForm = this._formBuilder.group({
      ActivityType:[''],
      sunact:['',Validators.required],
      description:['',Validators.required],
      gstType:[''],
      unit:['',Validators.required],
      unitplural:[''],
      unitdesc:['']
    });
  }
  //Drop Down Activity
  ActivityType(value){
  }
  // Drop Down Gst
  GstType(value){
  }
  // Drop Down Unit
  unitdesc(value){
  }
  // Drop Down Unit Plural
  unitplural(value){
  }
  //Save Activity
  ActivitySave(){
  }
  //Close Dialog
  CloseActivity(): void {
    this.dialogRef.close(false);
  }

}
