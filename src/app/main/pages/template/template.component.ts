import { Component, OnInit, ViewChild, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { ContactService, TemplateListDetails, TableColumnsService } from 'app/_services';
import { fuseAnimations } from '@fuse/animations';
import { MatterDialogComponent } from '../time-entries/matter-dialog/matter-dialog.component';
import { ContactSelectDialogComponent } from '../contact/contact-select-dialog/contact-select-dialog.component';
import * as $ from 'jquery';
import { InvoiceDialogComponentForTemplate } from '../invoice/select-invoice-dialog/select-invoice-dialog.component';
import { MatterDialogComponentForTemplate } from './matter-dialog/matter-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TemplateComponent implements OnInit {
  displayedColumns: any = ['TEMPLATETYPE', 'TEMPLATENAME'];
  //displayedColumns: string[];
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  highlightedRows: any;
  currentMatterData: any;
  Templatedata: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLoadingResults: boolean;
  pageSize: any;
  abc: number;
  parentMessage: any;
  @Output() matterDetail: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private toastr: ToastrService,
    public _getContact: ContactService,
    public TemplateListData: TemplateListDetails,
    public MatDialog: MatDialog,
    private TableColumnsService: TableColumnsService,
    private router:Router,
    public _matDialog: MatDialog,
  ) { }

  ngOnInit() {
    // let i=0;
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + $('.sticky_search_div').height() + 130)) + 'px');
    let d = {};
    this.isLoadingResults = true;
    this.TemplateListData.getTemplateList(d).subscribe(response => {
      console.log(response);
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


  onSearch(searchFilter: any) {
    if (searchFilter['key'] === "Enter" || searchFilter == 'Enter') {
      console.log(searchFilter);
    }
  }
  editContact(Row: any) {
    console.log(Row);
    // this.TemplateListData.getData(Row);
    this.parentMessage = Row;
    this.matterDetail.emit(Row);
    // localStorage.setItem('templateData',Row);
    localStorage.setItem('templateData', JSON.stringify(Row));
    this.currentMatterData = Row;

  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  public selectMatter() {
    if (this.router.url=="/create-document/invoice") {
      // this._router.navigate(['/create-document/invoice']);
      const dialogRef = this._matDialog.open(InvoiceDialogComponentForTemplate, {
          width: '100%',
          disableClose: true,
          data: 'select_matter',
          
      });
      dialogRef.afterClosed().subscribe(result => { 
          if (result) {
              localStorage.setItem('set_active_matters', JSON.stringify(result));
              // this.router.navigate(['time-billing/work-in-progress/invoice']);
          }
      });

  } else if( this.router.url=="/create-document/matter") {
      const dialogRef = this._matDialog.open(MatterDialogComponentForTemplate, {
          width: '100%',
          disableClose: true,
          data: 'select_matter'
      });
      dialogRef.afterClosed().subscribe(result => {
          if (result) {
              localStorage.setItem('set_active_matters', JSON.stringify(result));
              // this.router.navigate(['time-billing/work-in-progress/invoice']);
          }
      });
  }

    // const dialogRef = this.MatDialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: null });
    // dialogRef.afterClosed().subscribe(result => {
    // });
  }
  ContactMatter() {
    const dialogRef = this.MatDialog.open(ContactSelectDialogComponent, { width: '100%', disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
