import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { ChronologyService } from './../../../../_services/chronology.service';




@Component({
  selector: 'app-chronology',
  templateUrl: './chronology.component.html',
  styleUrls: ['./chronology.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ChronologyComponent implements OnInit {

  displayedColumns: string[] = ['date', 'topic', 'reference', 'event_agreed', 'brief_page_no', 'comment', 'privileged', 'witnesses', 'text'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  val;

  constructor(private dialog: MatDialog,private chronology_service: ChronologyService) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    //get chronology
    this.chronology_service.getData().subscribe(res => {
      this.val = res;
      // this.filterData = res;
    
      console.log(this.val);
    },
    err => {
      console.log('Error occured');
    }
  );
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.data = { 'data': ['date', 'topic', 'reference', 'event_agreed', 'brief_page_no', 'comment', 'privileged', 'witnesses', 'text'], 'type': 'chronology' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      if(result){
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
  { date: new Date('2/1/2014'), topic: 'silq', reference: 'www.google.com', event_agreed: 'yes', brief_page_no: 10, comment: 'not done yet', privileged: 10, witnesses: 5, text: 12 },
  { date: new Date('2/1/2014'), topic: 'silq', reference: 'www.google.com', event_agreed: 'yes', brief_page_no: 10, comment: 'not done yet', privileged: 10, witnesses: 5, text: 12 },
  { date: new Date('2/1/2014'), topic: 'silq', reference: 'www.google.com', event_agreed: 'yes', brief_page_no: 10, comment: 'not done yet', privileged: 10, witnesses: 5, text: 12 },
  { date: new Date('2/1/2014'), topic: 'silq', reference: 'www.google.com', event_agreed: 'yes', brief_page_no: 10, comment: 'not done yet', privileged: 10, witnesses: 5, text: 12 },
  { date: new Date('2/1/2014'), topic: 'silq', reference: 'www.google.com', event_agreed: 'yes', brief_page_no: 10, comment: 'not done yet', privileged: 10, witnesses: 5, text: 12 },
  { date: new Date('2/1/2014'), topic: 'silq', reference: 'www.google.com', event_agreed: 'yes', brief_page_no: 10, comment: 'not done yet', privileged: 10, witnesses: 5, text: 12 },
  { date: new Date('2/1/2014'), topic: 'silq', reference: 'www.google.com', event_agreed: 'yes', brief_page_no: 10, comment: 'not done yet', privileged: 10, witnesses: 5, text: 12 },

];
