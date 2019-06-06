import { Component, OnInit, Input, ViewChild, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { TimersService } from 'app/_services';


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
  invoiceData: any;
  displayedColumnsTime: string[] = ['ADDITIONALTEXT', 'PRICE', 'GST', 'PRICEINCGST'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private _timersService: TimersService) { }

  ngOnInit() {
    let matterDetail = JSON.parse(localStorage.getItem('set_active_matters'));
    this._timersService.getTimeEnrtyData({ MATTERGUID: matterDetail.MATTERGUID, Invoiced: 'No' }).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.invoiceData = new MatTableDataSource(response.DATA.WORKITEMS);
        let EXTOTAL: number = 0;
        let INTOTAL: number = 0;
        let TOTALGST: number = 0;
        response.DATA.WORKITEMS.forEach(function (value) {
          EXTOTAL += Number(value.PRICE);
          INTOTAL += Number(value.PRICEINCGST);
          TOTALGST += Number(value.GST);
        });
        this.totalDataOut.emit({ EXTOTAL: EXTOTAL, INTOTAL: INTOTAL, TOTALGST: TOTALGST });
      }
    }, error => {
      console.log(error);
    });
  }

}
