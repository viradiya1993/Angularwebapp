import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
    position:number;
    Type: string;
    Date: string;
    Amount: string;
    Payor: string;
  }
  const ELEMENT_DATA: PeriodicElement[] = [
   
    {position: 1 ,Type: "banking", Date : '22/10/2019',Amount:'$500', Payor:'SILQ'},
    {position: 2 ,Type: "banking", Date : '22/10/2019',Amount:'$500', Payor:'SILQ'},
    {position: 3 ,Type: "banking", Date : '22/10/2019',Amount:'$500', Payor:'SILQ'},
    {position: 4 ,Type: "banking", Date : '22/10/2019',Amount:'$500', Payor:'SILQ'},
    {position: 5 ,Type: "banking", Date : '22/10/2019',Amount:'$500', Payor:'SILQ'},
    {position: 6 ,Type: "banking", Date : '22/10/2019',Amount:'$500', Payor:'SILQ'},
    
  ];
  


@Component({
  selector: 'app-select-banking-dialog',
  templateUrl: './select-banking-dialog.component.html',
  styleUrls: ['./select-banking-dialog.component.scss'],
  animations: fuseAnimations
})
export class SelectBankingDialogComponent implements OnInit {

  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  contectTitle = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
    displayedColumns: string[] = ['select', 'position', 'Type', 'Date', 'Amount','Payor'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    selection = new SelectionModel<PeriodicElement>(true, []);
  
    ngOnInit(){
        
    }
    // need to remove all three fucction when api start working 
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }

    masterToggle() {
      this.isAllSelected() ?
          this.selection.clear() :
          this.dataSource.data.forEach(row => this.selection.select(row));   
    }
    checkboxLabel(row?: PeriodicElement): string {
      if (!row) {
        return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }
   
    rowSelected(val){

    }
 
}
