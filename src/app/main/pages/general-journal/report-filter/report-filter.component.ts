import { Component, OnInit,Injectable,ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-report-filter',
  templateUrl: './report-filter.component.html',
  styleUrls: ['./report-filter.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
 
})
export class ReportFilterComponent implements OnInit {
  isLoadingResults: boolean = false;
  FilterForm:FormGroup;
  isspiner: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ReportFilterComponent>,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.FilterForm= this._formBuilder.group({
      GeneralJournal:[],
      date:[new Date()],
    });
  }
  //choosedDate
  choosedDate(){

  }
  //SaveFilter
  SaveFilter(){

  }

}
