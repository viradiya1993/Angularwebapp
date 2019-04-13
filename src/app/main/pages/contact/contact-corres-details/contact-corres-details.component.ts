import { Component, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog, MatDialogRef } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MattersService, ContactService } from './../../../../_services';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';



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
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : 'green';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  getin: any;
  getDataForTable: any;
  getContactData: any;
  isLoadingResults: boolean = false;
  constructor(
    public _getContact: ContactService,
    private _getMattersService: MattersService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ContactCorresDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.getMatterGuid = this.data
  }

  ngOnInit() {
    this.isLoadingResults = true;
    this.getin = { MatterGuid: this.getMatterGuid }
    this._getMattersService.getMattersContact(this.getin).subscribe(res => {
      if (res.MatterContact.DataSet[0]) {
        this.highlightedRows = res.MatterContact.DataSet[0].PERSONGUID;
        localStorage.setItem('contactGuid', res.MatterContact.DataSet[0].PERSONGUID);
      }
      if (Object.keys(res.MatterContact.DataSet).length == 1) {
        this.selectButton();
      }
      this.getDataForTable = new MatTableDataSource(res.MatterContact.DataSet);
      this.getDataForTable.paginator = this.paginator;
      this.isLoadingResults = false;

    });
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
