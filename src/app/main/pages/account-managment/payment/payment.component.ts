import { Component, OnInit } from '@angular/core';
import { MainAPiServiceService } from 'app/_services';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  constructor(private _mainAPiServiceService:MainAPiServiceService) { }

  ngOnInit() {
    this._mainAPiServiceService.getSetData({}, 'HOGetPaymentDetailURL').subscribe(response=>{
   
     })
  }

}
