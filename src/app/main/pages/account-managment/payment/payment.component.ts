import { Component, OnInit } from '@angular/core';
import { MainAPiServiceService } from 'app/_services';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  safeSrc: any = "";
  isLoadingResults: boolean = false;
  constructor(private sanitizer: DomSanitizer, private _mainAPiServiceService: MainAPiServiceService) { }
  ngOnInit() {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({}, 'HOGetPaymentDetailURL').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(response.DATA.RETURNURL);
        this.isLoadingResults = false;
      } else {
        this.isLoadingResults = false;
      }
    })
  }

}
