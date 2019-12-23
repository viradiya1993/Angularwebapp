import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService, BehaviorService, TimersService } from 'app/_services';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-re-calc-timeEntrie-dialoge',
  templateUrl: './re-calc-timeEntrie-dialoge.component.html',
  styleUrls: ['./re-calc-timeEntrie-dialoge.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ReCalcTimeEntriesDialogeComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  @Input() SettingForm: FormGroup;
  @Input() errorWarningData: any;

  addData: any = [];
  TemplateName: any;
  getSelectedWIP: any;
  getSelectedWIPNewPrice: any = [];
  IsWipData: boolean = false;
  isLoadingResults: boolean = true;
  isspiner: boolean = false;
  successMsg: any = 'Time entry update successfully';
  constructor(private _mainAPiServiceService: MainAPiServiceService, private Timersservice: TimersService, private toastr: ToastrService, public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<ReCalcTimeEntriesDialogeComponent>, private behaviourService: BehaviorService) {

    this.behaviourService.workInProgress$.subscribe(result => {
      if (result) {
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
        if (response.CODE == 200 && response.STATUS == "success") {
          this.getSelectedWIPNewPrice = response.DATA;
          if (this.getSelectedWIP.PRICE == this.getSelectedWIPNewPrice.PRICE)
            this.IsWipData = false;
        }
        this.isLoadingResults = false;
      })
    } else {
      this.isLoadingResults = false;
      this.IsWipData = false;
    }
  }


  ChangePrice() {
    this.isspiner = true;
    this.getSelectedWIP.PRICE = this.getSelectedWIPNewPrice.PRICE;
    this.getSelectedWIP.GST = this.getSelectedWIPNewPrice.GST;
    this.getSelectedWIP.PRICEINCGST = this.getSelectedWIPNewPrice.PRICEINCGST;
    let PostData: any = this.getSelectedWIP;
    this.successMsg = 'Time entry Update successfully';
    let PostTimeEntryData: any = { FormAction: 'update', VALIDATEONLY: true, Data: PostData };
    this.Timersservice.SetWorkItems(PostTimeEntryData).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.checkValidation(res.DATA.VALIDATIONS, PostTimeEntryData);
      } else if (res.CODE == 451 && res.STATUS == 'warning') {
        this.checkValidation(res.DATA.VALIDATIONS, PostTimeEntryData);
      } else if (res.CODE == 450 && res.STATUS == 'error') {
        this.checkValidation(res.DATA.VALIDATIONS, PostTimeEntryData);
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, err => {
      this.isspiner = false;
      this.toastr.error(err);
    });
  }

  checkValidation(bodyData: any, PostTimeEntryData: any) {
    let errorData: any = [];
    let warningData: any = [];
    let tempError: any = [];
    let tempWarning: any = [];
    // errorData
    bodyData.forEach(function (value) {
      if (value.VALUEVALID == 'NO') {
        errorData.push(value.ERRORDESCRIPTION);
        tempError[value.FIELDNAME] = value;
      } else if (value.VALUEVALID == 'WARNING') {
        tempWarning[value.FIELDNAME] = value;
        warningData.push(value.ERRORDESCRIPTION);
      }
    });
    this.errorWarningData = { "Error": tempError, 'warning': tempWarning };
    if (Object.keys(errorData).length != 0) {
      this.toastr.error(errorData);
      this.isspiner = false;
    } else if (Object.keys(warningData).length != 0) {
      // this.toastr.warning(warningData);
      this.confirmDialogRef = this.MatDialog.open(FuseConfirmDialogComponent, {
        disableClose: true,
        width: '100%',
        data: warningData
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.isspiner = true;
          this.saveTimeEntry(PostTimeEntryData);
        }
        this.confirmDialogRef = null;
      });
    } else if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0) {
      this.saveTimeEntry(PostTimeEntryData);
      this.isspiner = false;
    }
  }
  saveTimeEntry(PostTimeEntryData: any) {
    PostTimeEntryData.VALIDATEONLY = false;
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
