import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { ChronologyService } from './../../../../_services';
import { ToastrService } from 'ngx-toastr';




@Component({
  selector: 'app-chronology',
  templateUrl: './chronology.component.html',
  styleUrls: ['./chronology.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ChronologyComponent implements OnInit {
  currentMatter: any = JSON.parse(localStorage.getItem('set_active_matters'));
  displayedColumns: string[] = ['MATTERGUID', 'CHRONOLOGYGUID', 'DATEFROM', 'DATETO', 'TIMEFROM', 'TIMETO', 'FORMAT', 'FORMATTEDDATE',
    'TOPIC', 'BRIEFPAGENO', 'REFERENCE', 'COMMENT', 'WITNESSES', 'EVENTAGREED', 'DOCUMENTNAME', 'ADDITIONALTEXT', 'SHORTNAME', 'CLIENTNAME'];
  //dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  chronology_table;

  constructor(private dialog: MatDialog, private chronology_service: ChronologyService, private toastr: ToastrService) { }

  ngOnInit() {
    //get chronology
    let potData = { 'MatterGuid': this.currentMatter.MATTERGUID };
    this.chronology_service.getData(potData).subscribe(response => {
      localStorage.setItem('session_token', response.Chronology.SessionToken);
      //this.chronology_table = res;
      console.log(response);
      if (response.Chronology.response != "error - not logged in") {
        this.chronology_table = new MatTableDataSource(response.Chronology.DataSet);
        this.chronology_table.paginator = this.paginator;
      } else {
        this.toastr.error(response.Chronology.response);
      }
    },
      error => {
        this.toastr.error(error);
      }
    );
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.data = {
      'data': ['MATTERGUID', 'CHRONOLOGYGUID', 'DATEFROM', 'DATETO', 'TIMEFROM', 'TIMETO', 'FORMAT', 'FORMATTEDDATE',
        'TOPIC', 'BRIEFPAGENO', 'REFERENCE', 'COMMENT', 'WITNESSES', 'EVENTAGREED', 'DOCUMENTNAME', 'ADDITIONALTEXT', 'SHORTNAME', 'CLIENTNAME'], 'type': 'chronology'
    };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      if (result) {
        localStorage.setItem(dialogConfig.data.type, JSON.stringify(result));
      }
    });
    dialogRef.afterClosed().subscribe(data =>
      this.tableSetting(data)
    );
  }
  tableSetting(data: any) {
    if (data !== false) {
      this.displayedColumns = data;
    }
  }


}
export interface PeriodicElement {
  date: Date;
  topic: string;
  reference: string;
  event_agreed: string;
  brief_page_no: number;
  comment: string;
  privileged: number;
  witnesses: number;
  text: number;
}

const ELEMENT_DATA: PeriodicElement[] = [

];
