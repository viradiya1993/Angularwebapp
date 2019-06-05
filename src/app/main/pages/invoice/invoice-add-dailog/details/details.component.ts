import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
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
  invoiceData: any;
  displayedColumnsTime: string[] = ['ADDITIONALTEXT', 'PRICECHARGED', 'GST', 'PRICEINCGSTCHARGED'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private _timersService: TimersService) { }

  ngOnInit() {
    let matterDetail = JSON.parse(localStorage.getItem('set_active_matters'));
    this._timersService.getTimeEnrtyData({ MATTERGUID: matterDetail.MATTERGUID, Invoiced: 'No' }).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        response.DATA.WORKITEMS.forEach(function (value) {
          console.log(value);
        });
        this.invoiceData = new MatTableDataSource(response.DATA.WORKITEMS);
        this.invoiceData.paginator = this.paginator;
      }
    }, error => {
      console.log(error);
    });
  }

}
