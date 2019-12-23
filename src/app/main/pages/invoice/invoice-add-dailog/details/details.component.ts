import { Component, OnInit, Input, ViewChild, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { MainAPiServiceService } from 'app/_services';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DetailsComponent implements OnInit {
  @Input() addInvoiceForm: FormGroup;
  @Output() totalDataOut: EventEmitter<any> = new EventEmitter<any>();
  invoiceData: any = [];
  displayedColumnsTime: string[] = ['select', 'ADDITIONALTEXT', 'ITEMDATE', 'PRICE', 'GST', 'PRICEINCGST'];
  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: false}) sort: MatSort;
  selection = new SelectionModel(true, []);
  constructor(
    private _mainAPiServiceService: MainAPiServiceService) { }

  ngOnInit() {
    let matterDetail = JSON.parse(localStorage.getItem('set_active_matters'));
    this._mainAPiServiceService.getSetData({ MATTERGUID: matterDetail.MATTERGUID, Invoiced: 'No' }, 'GetWorkItems').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.invoiceData = new MatTableDataSource(response.DATA.WORKITEMS);
        this.invoiceData.sort = this.sort;
        this.masterToggle();
        this.totalDataOut.emit(response.DATA.WORKITEMS);
      }
    }, error => {
      console.log(error);
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if (this.invoiceData.data) {
      const numSelected = this.selection.selected.length;
      const numRows = this.invoiceData.data.length;
      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.invoiceData)
      this.isAllSelected() ? this.selection.clear() : this.invoiceData.data.forEach(row => this.selection.select(row));
  }
  retuenData() {
    this.totalDataOut.emit(this.selection.selected);
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

}
