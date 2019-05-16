import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { MatterAddressPopupComponent } from '../matter-address-popup/matter-address-popup.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-property-purchase',
  templateUrl: './property-purchase.component.html',
  styleUrls: ['./property-purchase.component.scss']
})
export class PropertyPurchaseComponent implements OnInit {

  constructor(public MatDialog: MatDialog, private datepipe: DatePipe) { }

  @Input() matterdetailForm: FormGroup;
  ngOnInit() {
  }
  public Matteraddress() {
    const dialogRef = this.MatDialog.open(MatterAddressPopupComponent, { width: '100%', disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      //  console.log(result);
      if (result) {
        // this.matterdetailForm.controls['Clientmatter'].setValue(result.MATTERGUID);
        //this.matterdetailForm.controls['Clientmatter'].setValue(result.SHORTNAME + ' : ' + result.MATTER);
        // this.matterChange('MatterGuid', result.MATTERGUID);
      }
    });
  }
  ExchangeDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['EXCHANGEDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  SettlementDate2(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['SETTLEMENTDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  DatePaid(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['DATEPAID'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  BalanceDepositDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['BALANCEDEPOSITDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }

}
