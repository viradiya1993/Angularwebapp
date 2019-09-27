import { Component, OnInit } from '@angular/core';
import { MainAPiServiceService } from 'app/_services';
import { MatDatepickerInputEvent } from '@angular/material';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.scss']
})
export class ReceiptsComponent implements OnInit {
  ReceipttData: any = [];
  isLoadingResults: boolean = false;
  constructor(private _mainAPiServiceService: MainAPiServiceService, public datepipe: DatePipe, ) { }

  ngOnInit() {
    this.loadData({});
  }
  choosedDate(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value['begin'], 'dd/MM/yyyy');
    let end = this.datepipe.transform(event.value['end'], 'dd/MM/yyyy');
    this.loadData({ ITEMDATESTART: begin, ITEMDATEEND: end });
  }
  loadData(filterData: any) {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData(filterData, 'HOGetReceipts').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.ReceipttData = response.DATA.RECEIPTS;
        this.isLoadingResults = false;
      } else {
        this.isLoadingResults = false;
      }
    });
  }
}
