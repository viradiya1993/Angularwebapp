import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDatepickerInputEvent, MatPaginator, MatTableDataSource, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorService, MainAPiServiceService, TimersService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { round } from 'lodash';
@Component({
  selector: 'app-estimate-dilog',
  templateUrl: './estimate-dilog.component.html',
  styleUrls: ['./estimate-dilog.component.scss']
})
export class EstimateDilogComponent implements OnInit {
  errorWarningData: any = { "Error": [], 'Warning': [] };
  estimateform: FormGroup;
  isLoadingResults: boolean = false;
  dialogTitle: string;
  action: string;
  cuurentmatter = JSON.parse(localStorage.getItem('set_active_matters'));
  isspiner: boolean = false;
  isreadonly: boolean = false;
  FormAction: string;
  EstimateGuid: any;
  MatterGuid: string;
  userList: any;
  PRICEINCGSTVAL: any;
  PRICEVAL: any;
  ActivityList: any = [];
  EstimateData: any = [];
  Serivcelist: any;
  optionList: any = [
    { 'ACTIVITYID': 'hh:mm', 'DESCRIPTION': 'hh:mm' },
    { 'ACTIVITYID': 'H', 'DESCRIPTION': 'Hours' },
    { 'ACTIVITYID': 'M', 'DESCRIPTION': 'Minutes' },
    { 'ACTIVITYID': 'D', 'DESCRIPTION': 'Days' },
    { 'ACTIVITYID': 'U', 'DESCRIPTION': 'Units' },
    { 'ACTIVITYID': 'F', 'DESCRIPTION': 'Fixed' }
  ];
  calculateData: any = {
    QuantityType: '', Quantity: '', FeeEarner: ''
  };
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  constructor(
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<EstimateDilogComponent>,
    private _formBuilder: FormBuilder,
    private behaviorService: BehaviorService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    public _matDialog: MatDialog,
    private _mainAPiServiceService: MainAPiServiceService,
    private Timersservice: TimersService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.action = data.action;
    if (this.action === 'new') {
      this.dialogTitle = 'New Estimate';
    } else if (this.action === 'edit') {
      this.dialogTitle = 'Update Estimate';
    } else {
      this.dialogTitle = 'Duplicate Estimate';
    }
    this.behaviorService.estimatelegalData$.subscribe(result => {
      if (result) {
        this.EstimateData = result;
      }
    });
    this.behaviorService.dialogClose$.subscribe(result => {
      if (result != null) {
        if (result.MESSAGE == 'Not logged in') {
          this.dialogRef.close(false);
        }
      }
    });
  }

  ngOnInit() {
    this.estimateform = this._formBuilder.group({
      FEEEARNER: [''],
      SERVICE: [''],
      MINQUATITY: [''],
      MINTYPE: ['H'],
      MINPRICE: [''],
      MININCGST: [''],
    });
    if (this.action == 'edit' || this.action == 'duplicate') {
      this.EditPopUpOPen();
    }
    this.ActivityList = this.optionList;
    let userType = JSON.parse(localStorage.getItem('currentUser'));
    if (userType) {
      this.estimateform.controls['FEEEARNER'].setValue(userType.UserId);
    }
    this.estimateform.controls['MINQUATITY'].setValue(0);
    this.Timersservice.GetLookupsData({}).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.Serivcelist = res.DATA.LOOKUPS;
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      } else {
        this.Serivcelist = [];
      }
      this.isLoadingResults = false;
    }, err => {
      this.toastr.error(err);
    });
    this.calculateData.QuantityType = 'H';
    this.isLoadingResults = true;
    this.Timersservice.GetUsers({}).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.userList = res.DATA.USERS;
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      } else {
        this.userList = [];
      }
      this.isLoadingResults = false;
    }, err => {
      this.toastr.error(err);
    });
  }
  calcPE() {
    this.PRICEINCGSTVAL = round(this.f.MINPRICE.value * 1.1).toFixed(2);
  }
  calcPI() {
    this.PRICEVAL = round(this.f.MININCGST.value / 1.1).toFixed(2);
  }
  //Return All Form Control
  get f() {
    return this.estimateform.controls;
  }
  //FEEEARNER
  matterChange(key: any, event: any) {
    this.calculateData.FeeEarner = this.f.FEEEARNER.value;
    if (key === 'QuantityType') {
      switch (event) {
        case 'hh:mm': {
          this.calculateData.QuantityType = 'X';
          break;
        }
        case 'Hours': {
          this.calculateData.QuantityType = 'H';
          break;
        }
        case 'Minutes': {
          this.calculateData.QuantityType = 'M';
          break;
        }
        case 'Days': {
          this.calculateData.QuantityType = 'D';
          break;
        }
        case 'Units': {
          this.calculateData.QuantityType = 'U';
          break;
        }
        case 'Fixed': {
          this.calculateData.QuantityType = 'F';
          break;
        }
        default: {
          this.calculateData.QuantityType = 'F';
          break;
        }
      }
    }
    this.calculateData.Quantity = this.f.MINQUATITY.value;
    if (this.calculateData.Quantity != '' && this.calculateData.QuantityType != '') {
      this.isLoadingResults = true;
      this.Timersservice.CalcWorkItemCharge(this.calculateData).subscribe(response => {
        if (response.CODE == 200 && response.STATUS == "success") {
          let CalcWorkItemCharge = response.DATA;
          this.estimateform.controls['MINPRICE'].setValue(CalcWorkItemCharge.PRICE);
          this.estimateform.controls['MININCGST'].setValue(CalcWorkItemCharge.PRICEINCGST);
          this.isLoadingResults = false;
        } else if (response.MESSAGE == 'Not logged in') {
          this.dialogRef.close(false);
        }
      }, err => {
        this.isLoadingResults = false;
        this.toastr.error(err);
      });
    }

  }
  //EstimateEdit
  EditPopUpOPen() {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({ ESTIMATEITEMGUID: this.EstimateData.ESTIMATEITEMGUID }, 'GetMatterEstimateItem').subscribe(result => {
      if (result.CODE == 200 && result.STATUS == "success") {
        this.estimateform.controls['FEEEARNER'].setValue(result.DATA.ESTIMATEITEMS[0].FEEEARNER);
        this.estimateform.controls['SERVICE'].setValue(result.DATA.ESTIMATEITEMS[0].SERVICE);
        this.estimateform.controls['MINQUATITY'].setValue(result.DATA.ESTIMATEITEMS[0].QUANTITYFROM);
        this.estimateform.controls['MINTYPE'].setValue(result.DATA.ESTIMATEITEMS[0].QUANTITYTYPEFROM);
        this.estimateform.controls['MINPRICE'].setValue(result.DATA.ESTIMATEITEMS[0].PRICEFROM);
        this.estimateform.controls['MININCGST'].setValue(result.DATA.ESTIMATEITEMS[0].PRICEINCGSTFROM);
        this.isLoadingResults = false;
      }
    }, err => {
      this.toastr.error(err);
      this.isLoadingResults = false;
    });
  }
  //Serive
  ServiceChnage(value: any) {
    this.estimateform.controls['SERVICE'].setValue(value);
  }
  //EstimateSave
  EstimateSave() {
    if (this.action === 'new' || this.action === 'duplicate') {
      this.FormAction = 'insert';
      this.EstimateGuid = "";
    } else {
      this.FormAction = 'update';
      this.EstimateGuid = this.EstimateData.ESTIMATEITEMGUID
    }
    let data = {
      ESTIMATEITEMGUID: this.EstimateGuid,
      MATTERGUID: this.cuurentmatter.MATTERGUID,
      FEEEARNER: this.f.FEEEARNER.value,
      SERVICE: this.f.SERVICE.value,
      QUANTITYFROM: this.f.MINQUATITY.value,
      QUANTITYTYPEFROM: this.f.MINTYPE.value,
      PRICEFROM: this.f.MINPRICE.value,
      PRICEINCGSTFROM: this.f.MININCGST.value
    }
    // console.log(data);
    this.isspiner = true;
    let finalData = { DATA: data, FormAction: this.FormAction, VALIDATEONLY: true }
    this._mainAPiServiceService.getSetData(finalData, 'SetMatterEstimateItem').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.checkValidation(response.DATA.VALIDATIONS, finalData);
      } else if (response.CODE == 451 && response.STATUS == 'warning') {
        this.checkValidation(response.DATA.VALIDATIONS, finalData);
      } else if (response.CODE == 450 && response.STATUS == 'error') {
        this.checkValidation(response.DATA.VALIDATIONS, finalData);
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      } else {
        this.isspiner = false;
      }
    }, err => {
      this.toastr.error(err);
    });

  }
  checkValidation(bodyData: any, details: any) {
    let errorData: any = [];
    let warningData: any = [];
    let tempError: any = [];
    let tempWarning: any = [];
    bodyData.forEach(function (value) {
      if (value.VALUEVALID == 'No') {
        errorData.push(value.ERRORDESCRIPTION);
        tempError[value.FIELDNAME] = value;
      }
      else if (value.VALUEVALID == 'Warning') {
        tempWarning[value.FIELDNAME] = value;
        warningData.push(value.ERRORDESCRIPTION);
      }

    });
    this.errorWarningData = { "Error": tempError, 'Warning': tempWarning };
    if (Object.keys(errorData).length != 0) {
      this.toastr.error(errorData);
      this.isspiner = false;
    } else if (Object.keys(warningData).length != 0) {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: true,
        width: '100%',
        data: warningData
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.isspiner = true;
          this.EstimateSaveData(details);
        }
        this.confirmDialogRef = null;
      });
    } else if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0) {
      this.EstimateSaveData(details);
      this.isspiner = false;
    }
  }
  EstimateSaveData(data: any) {
    data.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(data, 'SetMatterEstimateItem').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        if (this.action !== 'edit') {
          this.toastr.success(' save successfully');
        } else {
          this.toastr.success(' update successfully');
        }
        this.isspiner = false;
        this.dialogRef.close(true);
      } else if (response.CODE == 451 && response.STATUS == 'warning') {
        this.toastr.warning(response.MESSAGE);
      } else if (response.CODE == 450 && response.STATUS == 'error') {
        this.toastr.error(response.MESSAGE);
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, error => {
      this.toastr.error(error);
    });
  }
}
