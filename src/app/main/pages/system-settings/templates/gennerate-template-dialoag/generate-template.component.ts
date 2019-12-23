import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService, BehaviorService } from 'app/_services';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { MatterDialogComponentForTemplate } from 'app/main/pages/template/matter-dialog/matter-dialog.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-generate-template',
  templateUrl: './generate-template.component.html',
  styleUrls: ['./generate-template.component.scss'],
  animations: fuseAnimations
})
export class GenerateTemplatesDialoagComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  displayedColumns: any = ['TEMPLATETYPE', 'TEMPLATENAME'];
  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  isLoadingResults: boolean;
  Templatedata: any = [];
  getTemplateArray: any = [];
  TemplateGenerateData:any=[];
  highlightedRows: any;
  getDropDownValue: any = [];
  getRoeData:any=[];
  pageSize: any;
  constructor(private _mainAPiServiceService: MainAPiServiceService, private toastr: ToastrService,
    public dialogRef: MatDialogRef<GenerateTemplatesDialoagComponent>,   public _matDialog: MatDialog,private router:Router,
    public behaviorService:BehaviorService ) { }
  
    ngOnInit() {
    this.LoadData({});
  }
  
  LoadData(data){
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData(data, 'TemplateList').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.Templatedata = new MatTableDataSource(response.DATA.TEMPLATES);
        this.Templatedata.paginator = this.paginator;
        if (response.DATA.TEMPLATES[0]) {
          // localStorage.setItem('contactGuid', response.DATA.CONTACTS[0].CONTACTGUID);
          this.highlightedRows = response.DATA.TEMPLATES[0].TEMPLATENAME;
        }
        this.isLoadingResults = false;
      }
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
 
  FirstClickTemplate(data){
    this.getRoeData=data;
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
 
  dblclickrow(data) {

    if (data.TEMPLATETYPE == "Folder") {

      this.LoadData({ "Folder": data.TEMPLATENAME });
    } else if (data.TEMPLATETYPE == "Sub Folder") {

      this.LoadData({ "Sub Folder": data.TEMPLATENAME });
    }
    else {

      this.openDilog()
    }
  }
  openDilog() {
    this.behaviorService.TemplateGenerateData$.subscribe(result => {
      if(result){
        this.TemplateGenerateData=result; 
      }          
    });
    if (this.router.url == "/create-document/invoice-template") {
        let invoiceGUid = localStorage.getItem('edit_invoice_id');
        let passdata = { 'Context': "Invoice", 'ContextGuid': invoiceGUid, "Type": "Template", "Folder": '', "Template": this.TemplateGenerateData.TEMPLATENAME }
        this.ForDocDialogOpen(passdata);
    } else if (this.router.url == "/create-document/matter-template") {
        let matterData = JSON.parse(localStorage.getItem('set_active_matters'));
        let passdata = { 'Context': "Matter", 'ContextGuid': matterData.MATTERGUID, "Type": "Template", "Folder": '', "Template": this.TemplateGenerateData.TEMPLATENAME }
        this.ForDocDialogOpen(passdata);
      } else if (this.router.url == "/create-document/receive-money-template") {
        let ReceiptData = JSON.parse(localStorage.getItem('receiptData'));
        let passdata = { 'Context': "Income", 'ContextGuid': ReceiptData.INCOMEGUID, "Type": "Template", "Folder": '', "Template": this.TemplateGenerateData.TEMPLATENAME }
        this.ForDocDialogOpen(passdata);
    } else if (this.router.url == "/create-document/contact-template") {
        let ContactGuID = localStorage.getItem('contactGuid');
        let passdata = { 'Context': "Contact", 'ContextGuid': ContactGuID, "Type": "Template", "Folder": '', "Template": this.TemplateGenerateData.TEMPLATENAME }
        this.ForDocDialogOpen(passdata);
    }
}
//***********************************************************END Select Matter Contact*************************************************************************
ForDocDialogOpen(passdata) {

    const dialogRef = this._matDialog.open(MatterDialogComponentForTemplate, { width: '100%', disableClose: true, data: passdata });
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
            // localStorage.setItem('set_active_matters', JSON.stringify(result));
        }
    });
}
selectTemplate() {
   this.dialogRef.close( this.getRoeData.TEMPLATENAME);
}
}
