import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { MatterAddressPopupComponent } from '../matter-address-popup/matter-address-popup.component';
import { DatePipe } from '@angular/common';
import { MattersService } from 'app/_services';

@Component({
  selector: 'app-property-purchase',
  templateUrl: './property-purchase.component.html',
  styleUrls: ['./property-purchase.component.scss']
})
export class PropertyPurchaseComponent implements OnInit {
  ClientStatusData: any;
  constructor(public MatDialog: MatDialog, private _mattersService: MattersService, private datepipe: DatePipe) { }

  @Input() matterdetailForm: FormGroup;
  ngOnInit() {
    this._mattersService.getMattersClasstype({ 'LookupType': 'Client Status' }).subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.ClientStatusData = responses.DATA.LOOKUPS;
      }
    });
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
  ExchangeDateClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['EXCHANGEDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  StempDutyDateClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['STAMPDUTYDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }

  SettlementDateClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['SETTLEMENTDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  DatePaidClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['DATEPAID'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  BalanceDepositDateClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['BALANCEDEPOSITDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }

}
