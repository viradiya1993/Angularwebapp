import { Component, OnInit, Inject, AfterViewInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDatepickerInputEvent, MatPaginator, MatTableDataSource, MatDialogConfig } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MattersService, TimersService, TemplateListDetails } from './../../../../_services';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { MatterPopupComponent } from '../../matters/matter-popup/matter-popup.component';
import { TemplateComponent } from '../template.component';
import { environment } from 'environments/environment';

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
    
    this.ForHideShow=_data;
    if(_data!='select_matter'){
      this.title="View Template"
      this.CheckCondition=_data.DATA.DOCUMENTS[0];
      this.filefolder_Name=_data.DATA.DOCUMENTS[0].FILENAME;
      console.log( this.filefolder_Name);
      this.base_url=environment.ReportUrl;
    }else{
      console.log("data not in ");
      this.title="Select Matter";
    }
  
  }

  ngOnInit() {
    // this.data.currentMessage.subscribe(message =>{
    //   console.log(message);
    // });
    console.log();

    // localStorage.getItem('templateData');
    this.getDropValue();
    this.getMatterList();

    // this.TemplateListDetails.getData('').subscribe(response => {
    //   console.log(response);
    //   if (response.CODE == 200 && response.STATUS == "success") {
    //     // response.DATA.TEMPLATES.forEach(element => { 
    //     //   // this.abc=i++; 
    //     // });
    //     // console.log(this.abc);

    //   }
    // }, err => {
    //   this.isLoadingResults = false;
    //   this.toastr.error(err);
    // });
  }
  getDropValue() {
    let d = {};
    this.Timersservice.GetUsers(d).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.MatterDropData = response.DATA.USERS;
      }
    }, err => {
      console.log(err);
    });
  }
  selectMatterId(Row: any) {
    this.currentMatterData = Row;
  }
  getMatterList() {
    this.getList({});
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  get f() {
    return this.matterFilterForm.controls;
  }
  MatterChange(value) {
    this.filterVal.Active = value;
    this.getList(this.filterVal);
  }
  onSearch(searchFilter: any) {
    if (searchFilter['key'] === "Enter" || searchFilter == 'Enter') {
      this.filterVal.SearchString = this.f.searchFilter.value;
      this.getList(this.filterVal);
    }
  }
  MatterUserChange(value) {
    this.filterVal.FeeEarner = value;
    this.getList(this.filterVal);
  }
  getList(filterVal: any) {
    this.isLoadingResults = true;
    this.mattersService.getMatters(filterVal).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        if (response.DATA.MATTERS[0]) {
          this.highlightedRows = response.DATA.MATTERS[0].MATTERGUID;
          this.currentMatterData = response.DATA.MATTERS[0];
        }
        this.getDataForTable = new MatTableDataSource(response.DATA.MATTERS);
        this.getDataForTable.paginator = this.paginator;
        this.isLoadingResults = false;
      }
    }, error => {
      this.toastr.error(error);
    });
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  //select matter
  selectMatter(Row: any = "") {
    let data = JSON.parse(localStorage.getItem('templateData'));
    // console.log(this.currentMatterData.MATTERGUID);
    let passingData = {
      'Context': "Matter",
      'ContextGuid': this.currentMatterData.MATTERGUID,
      "Type": "Template",
      "Folder": '',
      "Template": data.TEMPLATENAME
    }
    this.TemplateListDetails.getGenerateTemplate(passingData).subscribe(response => {
      console.log(response);
      if (response.CODE == 200 && response.STATUS == "success") {
        this.toastr.success('Template Generate successfully');
        this.dialogRef.close(true);
        this.dialog.open(MatterDialogComponentForTemplate,{
          data:response
        });


      }
    }, error => {
      this.toastr.error(error);
      this.dialogRef.close(true);
    });
  }
  // New matter Pop-up
  AddNewmatterpopup() {
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(MatterPopupComponent, {
      width: '100%',
      disableClose: true,
      data: {
        action: 'new'
      }
    });

    dialogRef.afterClosed().subscribe(result => { });
  }
  // Edit matter Pop-up
  EditNewmatterpopup() {
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(MatterPopupComponent, {
      width: '100%',
      disableClose: true,
      data: {
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => { });
  }
}
