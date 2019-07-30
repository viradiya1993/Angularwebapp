import { Component, OnInit } from '@angular/core';
import { MainAPiServiceService } from 'app/_services';

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.scss']
})
export class ReceiptsComponent implements OnInit {

  constructor(private _mainAPiServiceService:MainAPiServiceService) { }

  ngOnInit() {
    this._mainAPiServiceService.getSetData({"ITEMDATESTART":"03/05/2017","ITEMDATEEND":"27/07/2019"}, 'HOGetReceipts').subscribe(response=>{
      // console.log(response);
      console.log(response);
     })
  }

}
