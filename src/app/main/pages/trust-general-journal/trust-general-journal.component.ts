import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig, MatDatepickerInputEvent, MatDialogRef } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from '../../sorting-dialog/sorting-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TimersService, TableColumnsService, BehaviorService } from '../../../_services';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common'
import * as $ from 'jquery';
import { MatSort } from '@angular/material';
import * as moment from 'moment';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-trust-general-journal',
  templateUrl: './trust-general-journal.component.html',
  styleUrls: ['./trust-general-journal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TrustGeneralJournalComponent implements OnInit {
  TrustGeneralForm: FormGroup;
  isLoadingResults: boolean = false;
  constructor(  
    private dialog: MatDialog,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private Timersservice: TimersService,
    public datepipe: DatePipe,
    private TableColumnsService: TableColumnsService,
    private behaviorService: BehaviorService,
    public MatDialog: MatDialog,) { }

  ngOnInit() {
    this.TrustGeneralForm = this.fb.group({
      DATE:[''],
      SEARCH:['']
    });
  }
  choosedDate(){

  }
  FilterSearch(value){
    
  }
  openDialog(){

  }
  changeValueOfCheckbox(){
    
  }
}
