import { Component, OnInit } from '@angular/core';
import { MainAPiServiceService } from 'app/_services';

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.scss']
})
export class ReceiptsComponent implements OnInit {
  ReceipttData:any=[];
  constructor(private _mainAPiServiceService: MainAPiServiceService) { }

  ngOnInit() {
    this._mainAPiServiceService.getSetData({}, 'HOGetReceipts').subscribe(response => {
      // console.log(response);
      console.log(response);
      this.ReceipttData=response.DATA.RECEIPTS;
    })
  }

}
