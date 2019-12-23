import { Component, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  MainAPiServiceService} from './../../../../_services';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-contact-corres-details',
  templateUrl: './contact-corres-details.component.html',
  styleUrls: ['./contact-corres-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ContactCorresDetailsComponent implements OnInit {
  displayedColumns: string[] = ['contact', 'type'];
  getMatterGuid: any;
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: false}) sort: MatSort;
  getin: any;
  getDataForTable: any;
  getContactData: any;
  isLoadingResults: boolean = false;
  pageSize: any;
  constructor(
    private _mainAPiServiceService: MainAPiServiceService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ContactCorresDetailsComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.getMatterGuid = this.data
  }

  ngOnInit() {
    this.isLoadingResults = true;
    this.getin = { MatterGuid: this.getMatterGuid }
    this._mainAPiServiceService.getSetData(this.getin, 'GetMatterContact').subscribe(res => {
      if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      } else {
        if (Object.keys(res.DATA.MATTERCONTACTS).length == 0) {
          this.toastr.error("Can't Find corresponding Details");
          this.dialogRef.close(false);
        } else if (Object.keys(res.DATA.MATTERCONTACTS).length == 1) {
          this.dialogRef.close(false);
          this.selectButton();
        } else if (Object.keys(res.DATA.MATTERCONTACTS).length != 0) {
          this.highlightedRows = res.DATA.MATTERCONTACTS[0].PERSONGUID;
          localStorage.setItem('contactGuid', res.DATA.MATTERCONTACTS[0].PERSONGUID);
        }
        this.getDataForTable = new MatTableDataSource(res.DATA.MATTERCONTACTS);
        this.getDataForTable.paginator = this.paginator;
        this.getDataForTable.sort = this.sort;
        this.isLoadingResults = false;
        this.pageSize = localStorage.getItem('lastPageSize');
      }
    });
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  ondialogcloseClick(): void {
    this.dialogRef.close(false);
  }
  editContact(event) {
    this.getMatterGuid = event;
    localStorage.setItem('contactGuid', event);
  }
  selectButton() {
    const dialogRef = this.dialog.open(ContactDialogComponent, { data: { action: 'edit' } });
    dialogRef.afterClosed().subscribe(result => { console.log(result); });
  }


}
