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
  btntext: string = "Edit";
  constructor(private sanitizer: DomSanitizer, private _mainAPiServiceService: MainAPiServiceService) { }
  ngOnInit() {
    this.ViewPamentDetails();
  }
  ViewPamentDetails() {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({}, 'HOGetPaymentDetailURL').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.btntext = 'Edit';
        this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(response.DATA.RETURNURL);
        this.isLoadingResults = false;
      } else {
        this.isLoadingResults = false;
      }
    });
  }
  editPamentDetails() {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({ URLOption: 'Edit' }, 'HOGetPaymentDetailURL').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.btntext = 'View';
        this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(response.DATA.RETURNURL);
        this.isLoadingResults = false;
      } else {
        this.isLoadingResults = false;
      }
    });
  }

}
