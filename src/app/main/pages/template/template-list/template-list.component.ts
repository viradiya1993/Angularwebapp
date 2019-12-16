import { Component, OnInit, ViewChild, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { MainAPiServiceService, BehaviorService } from 'app/_services';
import { fuseAnimations } from '@fuse/animations';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material';
import { MatterDialogComponentForTemplate } from '../matter-dialog/matter-dialog.component';
import { ContactSelectDialogComponent } from '../../contact/contact-select-dialog/contact-select-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TemplateListComponent implements OnInit {
  displayedColumns: any = ['TEMPLATETYPE', 'TEMPLATENAME'];
  //displayedColumns: string[];
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  highlightedRows: any;
  currentMatterData: any;
  Templatedata: any = [];
  TemplateGenerateData: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoadingResults: boolean;
  pageSize: any;
  abc: number;
  TemplateForm: FormGroup;
  parentMessage: any;
  @Output() matterDetail: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private toastr: ToastrService,
    private _mainAPiServiceService: MainAPiServiceService,
    public MatDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private router: Router,
    public _matDialog: MatDialog,
    private behaviorService: BehaviorService,
  ) { }

  ngOnInit() {
    // let i=0;
    this.TemplateForm = this._formBuilder.group({
      search: ['']
    });

    this.behaviorService.resizeTableForAllView();
    const behaviorService = this.behaviorService;
    $(window).resize(function () {
      behaviorService.resizeTableForAllView();
    });
    this.LoadData({})


  }
  LoadData(d) {
    this.isLoadingResults = true;

    this._mainAPiServiceService.getSetData(d, 'TemplateList').subscribe(response => {

      if (response.CODE == 200 && response.STATUS == "success") {
        this.Templatedata = new MatTableDataSource(response.DATA.TEMPLATES);

        this.editContact(response.DATA.TEMPLATES[0]);

        this.Templatedata.paginator = this.paginator;
        this.Templatedata.sort = this.sort;

        if (response.DATA.TEMPLATES[0]) {

          this.behaviorService.TemplateGenerateData(response.DATA.TEMPLATES[0]);
          // localStorage.setItem('contactGuid', response.DATA.CONTACTS[0].CONTACTGUID);
          this.highlightedRows = response.DATA.TEMPLATES[0].TEMPLATENAME;
        }
        this.isLoadingResults = false;
      }
    }, err => {

      this.toastr.error(err);
      this.isLoadingResults = false;
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  get f() {
    //console.log(this.contactForm);
    return this.TemplateForm.controls;
  }
  onSearch(searchFilter: any) {
    if (searchFilter['key'] === "Enter" || searchFilter == 'Enter') {
      this.LoadData({ SEARCH: this.f.search.value })
    }
  }
  editContact(Row: any) {
    if (Row.TEMPLATETYPE == "Folder") {
      $('#clickToolbarbtn').click();
      localStorage.setItem('handelGenerateDoc', 'Folder');
    } else {
      $('#clickToolbarbtn2').click();
      localStorage.setItem('handelGenerateDoc', 'Template');
    }
    this.parentMessage = Row;
    this.matterDetail.emit(Row);
    this.behaviorService.TemplateGenerateData(Row);

    this.currentMatterData = Row;

  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  selectMatter(data) {

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
      if (result) {
        this.TemplateGenerateData = result;
      }
    });
    if (this.router.url == "/create-document/invoice-template") {
      let invoiceGUid = localStorage.getItem('edit_invoice_id');
      let passdata = { 'Context': "Invoice", 'ContextGuid': invoiceGUid, "knownby": 'Template', "Type": "Template", "Folder": '', "Template": this.TemplateGenerateData.TEMPLATENAME }
      this.ForDocDialogOpen(passdata);
    } else if (this.router.url == "/create-document/matter-template") {
      let matterData = JSON.parse(localStorage.getItem('set_active_matters'));
      let passdata = { 'Context': "Matter", 'ContextGuid': matterData.MATTERGUID, "knownby": 'Template', "Type": "Template", "Folder": '', "Template": this.TemplateGenerateData.TEMPLATENAME }
      this.ForDocDialogOpen(passdata);
    } else if (this.router.url == "/create-document/receive-money-template") {
      let ReceiptData = JSON.parse(localStorage.getItem('receiptData'));
      let passdata = { 'Context': "Income", 'ContextGuid': ReceiptData.INCOMEGUID, "knownby": 'Template', "Type": "Template", "Folder": '', "Template": this.TemplateGenerateData.TEMPLATENAME }
      this.ForDocDialogOpen(passdata);
    } else if (this.router.url == "/create-document/contact-template") {
      let ContactGuID = localStorage.getItem('contactGuid');
      let passdata = { 'Context': "Contact", 'ContextGuid': ContactGuID, "knownby": 'Template', "Type": "Template", "Folder": '', "Template": this.TemplateGenerateData.TEMPLATENAME }
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
  ContactMatter() {
    const dialogRef = this.MatDialog.open(ContactSelectDialogComponent, {
      width: '100%', disableClose: true, data: {
        type: ""
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
