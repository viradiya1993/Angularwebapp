import { Component, OnInit, Inject, AfterViewInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDatepickerInputEvent, MatPaginator, MatTableDataSource, MatDialogConfig } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MainAPiServiceService } from './../../../../_services';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';

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
  filefolderUrlforEmail:any=[];
  title: string;
  filefolderUrl: any;
  Title:any;
  emailToadd: any;
  emailBCC: any;
  emailCC: any;
  emailSUBJECT: any;
  emailCONTENT: any;
  whichTypeTemplate: string;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private _mainAPiServiceService: MainAPiServiceService,
    public dialogRef: MatDialogRef<MatterDialogComponentForTemplate>,
    @Inject(MAT_DIALOG_DATA) public _data: any
    // private data:TemplateComponent
  ) {

    this.matterFilterForm = this.fb.group({ MatterFilter: [''], UserFilter: [''], searchFilter: [''], InvoiceFilter: [''], });
    // this.title="View Template"
   //need to call generate template api 
   console.log(_data);
    if(_data){
    this.base_url=environment.ReportUrl;
    this.filefolder_Name=_data.Template;
    this.Title =_data.Type == 'Email' ? 'Email' :'Document';
   this.whichTypeTemplate=_data.Type;
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
   
    this._mainAPiServiceService.getSetData(data, 'TemplateGenerate').subscribe(response => {
      console.log(response);
      if (response.CODE == 200 && response.STATUS == "success") {
        this.toastr.success('success');
        if(this._data.Type=="Template"){

          // this.whichTypeTemplate="Template";
          console.log('Template')
        this.filefolderUrl=response.DATA.DOCUMENTS[0].FILENAME;     
        }else if(this._data.Type=="Email"){
          // this.whichTypeTemplate="email";
        //  this.filefolderUrlforEmail=response.DATA.EMAILS[0].TOADDRESS;
         this.emailToadd=response.DATA.EMAILS[0].TOADDRESS;
         this.emailBCC=response.DATA.EMAILS[0].BCCADDRESS;
         this.emailCC=response.DATA.EMAILS[0].CCADDRESS;
         this.emailSUBJECT=response.DATA.EMAILS[0].SUBJECT;
         this.emailCONTENT=response.DATA.EMAILS[0].CONTENT;

        //  window.open("https://mail.google.com/mail/u/0/?view=cm&fs=1&to=someone@example.com&su=SUBJECT&body=BODY&bcc=someone.else@example.com&tf=1");        
        } 
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