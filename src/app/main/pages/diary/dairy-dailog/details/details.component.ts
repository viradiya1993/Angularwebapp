import { Component, OnInit, Inject,Input } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA,MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { MatterDialogComponent } from './../../../time-entries/matter-dialog/matter-dialog.component';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  @Input() DairyForm: FormGroup;
  filter = true;
  constructor(
    public MatDialog: MatDialog
  ) { }

  ngOnInit() {
  }
  get f() {
    return this.DairyForm.controls;
  }
   //SelectMatter
  SelectMatter(){
    const dialogRef = this.MatDialog.open(MatterDialogComponent, { 
      width: '100%', 
      disableClose: true,
      data:{} 
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
         this.DairyForm.controls['Matter'].setValue(result.MATTER);
      }
    });
  }
  
  //CheckReminder
  CheckReminder(value){
    if(value == true){
      this.DairyForm.controls['Beforestart'].enable();
    }else{
      this.DairyForm.controls['Beforestart'].disable();
    }
  }
  //ChnageCategory
  ChnageCategory(value){
    if(this.f.Category.value == 'Billable' || this.f.Category.value == 'Non-Billable'){
      this.DairyForm.controls['Matter'].enable();
    }else{
      this.DairyForm.controls['Matter'].disable();
    }
  }
}
