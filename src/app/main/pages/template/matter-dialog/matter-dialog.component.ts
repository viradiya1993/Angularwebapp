import { Component, OnInit, Inject, AfterViewInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDatepickerInputEvent, MatPaginator, MatTableDataSource, MatDialogConfig } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MattersService, TimersService, TemplateListDetails } from './../../../../_services';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { MatterPopupComponent } from '../../matters/matter-popup/matter-popup.component';
import { TemplateComponent } from '../template.component';
import { environment } from 'environments/environment';
import {MatSort} from '@angular/material';


@Component({
  selector: 'app-matter-dialog',
  templateUrl: './matter-dialog.component.html',
  styleUrls: ['./matter-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MatterDialogComponentForTemplate implements OnInit {
  message: string;
  displayedColumns: string[] = ['matternumber', 'matter', 'client'];
  getDataForTable: any = [];
  isspiner: boolean = false;
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  matterFilterForm: FormGroup;
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  isLoadingResults: boolean = false;
  pageSize: any;
  currentMatterData: any;
  MatterDropData: any;
  filterVal: any = { 'Active': '', 'FeeEarner': '', 'SearchString': '' };
  @Input() mattersDetailData;
  filefolder_Name: any;
  base_url: any;
  CheckCondition: any;
  ForHideShow: string;
  title: string;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private mattersService: MattersService,
    private toastr: ToastrService,
    private Timersservice: TimersService,
    private TemplateListDetails: TemplateListDetails,
    public dialogRef: MatDialogRef<MatterDialogComponentForTemplate>,
    @Inject(MAT_DIALOG_DATA) public _data: any
    // private data:TemplateComponent
  ) {

    this.matterFilterForm = this.fb.group({ MatterFilter: [''], UserFilter: [''], searchFilter: [''], InvoiceFilter: [''], });
    // this.title="View Template"
   //need to call generate template api 
   if(_data){
     console.log("constructor ")
    this.base_url=environment.ReportUrl;
    this.selectMatter(_data);
   }
   
  }

  ngOnInit() { 
  }
  
  get f() {
    return this.matterFilterForm.controls;
  }
  
  //select matter
  selectMatter(data) {
    this.isLoadingResults = true;
    console.log("matter called");
    this.TemplateListDetails.getGenerateTemplate(data).subscribe(response => {
      console.log(response);
      if (response.CODE == 200 && response.STATUS == "success") {
        this.toastr.success('Template Generate successfully');

        this.filefolder_Name=response.DATA.DOCUMENTS[0].FILENAME;
        this.isLoadingResults = false;
      }else if(response.CODE == 420 ){
        this.isLoadingResults = false;
        this.dialogRef.close();
      }
    }, error => {
    
      this.toastr.error(error);
      this.dialogRef.close();
    
    });
  }
 
}