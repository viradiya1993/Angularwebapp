import { Component, OnInit } from '@angular/core';
import { MainAPiServiceService, BehaviorService } from 'app/_services';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  safeSrc: any = "";
  isLoadingResults: boolean = false;
  btntext: string = "Edit";
  constructor(private sanitizer: DomSanitizer, private _mainAPiServiceService: MainAPiServiceService,
    private behaviorService:BehaviorService) { }
  ngOnInit() {
    this.ViewPamentDetails();
  }
  ViewPamentDetails() {
    this._mainAPiServiceService.getSetData({}, 'HOGetPaymentDetailURL').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.btntext = 'Edit';
        this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(response.DATA.RETURNURL);
        this.behaviorService.loadingAccountMNG('receipt');
      } else {
        this.behaviorService.loadingAccountMNG('payment');
      }
    });
  }
  editPamentDetails() {
    this.behaviorService.loadingAccountMNG(null);
    this._mainAPiServiceService.getSetData({ URLOption: 'Edit' }, 'HOGetPaymentDetailURL').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.btntext = 'View';
        this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(response.DATA.RETURNURL);
        this.behaviorService.loadingAccountMNG('payment');
      } else {
        this.behaviorService.loadingAccountMNG('payment');
      }
    });
  }

}
