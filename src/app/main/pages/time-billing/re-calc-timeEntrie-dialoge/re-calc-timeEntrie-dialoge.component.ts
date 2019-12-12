import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService, BehaviorService, TimersService } from 'app/_services';
import { MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-re-calc-timeEntrie-dialoge',
  templateUrl: './re-calc-timeEntrie-dialoge.component.html',
  styleUrls: ['./re-calc-timeEntrie-dialoge.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ReCalcTimeEntriesDialogeComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  @Input() errorWarningData: any;
  addData: any = [];
  TemplateName: any;
  getSelectedWIP: any;
  getSelectedWIPNewPrice: any;
  IsWipData: boolean = false;
  isspiner: boolean = false;
  successMsg: any = 'Time entry update successfully';
  constructor(private _mainAPiServiceService: MainAPiServiceService, private Timersservice: TimersService, private toastr: ToastrService,
    public dialogRef: MatDialogRef<ReCalcTimeEntriesDialogeComponent>, private behaviourService: BehaviorService) {

    this.behaviourService.workInProgress$.subscribe(result => {
      if (result) {
        console.log(result);
        this.getSelectedWIP = result;
      }
    });
  }

  ngOnInit() {
    if (this.getSelectedWIP.ITEMTYPEDESC == "WIP") {
      this.IsWipData = true;
      let sendData = {
        MATTERGUID: this.getSelectedWIP.MATTERGUID,
        FEEEARNER: this.getSelectedWIP.FEEEARNER,
        FEETYPE: this.getSelectedWIP.FEETYPE,
        QUANTITY: this.getSelectedWIP.QUANTITY,
        QUANTITYTYPE: this.getSelectedWIP.QUANTITYTYPE
      }
      this._mainAPiServiceService.getSetData(sendData, 'CalcWorkItemCharge').subscribe(response => {
        console.log(response);
        if (response.CODE == 200 && response.STATUS == "success") {
          this.getSelectedWIPNewPrice = response.DATA;
          // this.getSelectedWIP = this.getSelectedWIPNewPrice;
        }
      })
    } else {
      this.IsWipData = false;
    }
  }


  save() {
    this.isspiner = true;
    let PostData: any = this.getSelectedWIP;
    this.successMsg = 'Time entry Update successfully';
    let PostTimeEntryData: any = { FormAction: 'update', VALIDATEONLY: true, Data: PostData };
    this.Timersservice.SetWorkItems(PostTimeEntryData).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.toastr.success(this.successMsg);
        this.dialogRef.close(true);
      } else if (res.CODE == 451 && res.STATUS == 'warning') {
        this.toastr.warning(res.MESSAGE);
      } else if (res.CODE == 450 && res.STATUS == 'error') {
        this.toastr.warning(res.MESSAGE);
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, err => {
      this.isspiner = false;
      this.toastr.error(err);
    });
  }


}
