import { Component, OnInit, Input } from '@angular/core';
import { MainAPiServiceService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  BasicDetail: any = {
    BARRISTERID: '', LEGALENTITY: '', REGISTRATIONNAME: ' ', FIRSTNAME: ' ', MIDDLENAME: '', LASTNAME: '', ADDRESS: '', SUBURB: '', ADDRESSSTATE: '', POSTCODE: '',
    PHONE: '', MOBILE: '', EMAIL: '', ACCOUNTSEMAIL: '', MANAGEREMAIL: '', TECHNICALEMAIL: '', REGISTEREDUNTIL: '', INTROPRICEUNTIL: ''
  }
  isLoadingResults: boolean = false;
  isspiner: boolean = false;
  errorWarningData: any;
  constructor(public MatDialog: MatDialog, private _mainAPiServiceService: MainAPiServiceService, private toastr: ToastrService) { }

  ngOnInit() {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({}, 'HOGetCustomerDetails').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.BasicDetail.BARRISTERID = response.DATA.CUSTOMERDATA.BARRISTERID;
        this.BasicDetail.REGISTRATIONNAME = response.DATA.CUSTOMERDATA.REGISTRATIONGROUP.REGISTRATIONNAME;
        this.BasicDetail.FIRSTNAME = response.DATA.CUSTOMERDATA.NAMEGROUP.FIRSTNAME;
        this.BasicDetail.MIDDLENAME = response.DATA.CUSTOMERDATA.NAMEGROUP.MIDDLENAME;
        this.BasicDetail.LASTNAME = response.DATA.CUSTOMERDATA.NAMEGROUP.LASTNAME;
        this.BasicDetail.LEGALENTITY = response.DATA.CUSTOMERDATA.LEGALENTITY;
        this.BasicDetail.ADDRESS = response.DATA.CUSTOMERDATA.ADDRESSGROUP.ADDRESS;
        this.BasicDetail.SUBURB = response.DATA.CUSTOMERDATA.ADDRESSGROUP.SUBURB;
        this.BasicDetail.ADDRESSSTATE = response.DATA.CUSTOMERDATA.ADDRESSGROUP.ADDRESSSTATE;
        this.BasicDetail.POSTCODE = response.DATA.CUSTOMERDATA.ADDRESSGROUP.POSTCODE;
        this.BasicDetail.PHONE = response.DATA.CUSTOMERDATA.PHONE;
        this.BasicDetail.MOBILE = response.DATA.CUSTOMERDATA.MOBILE;
        this.BasicDetail.EMAIL = response.DATA.CUSTOMERDATA.EMAILS.EMAIL;
        this.BasicDetail.ACCOUNTSEMAIL = response.DATA.CUSTOMERDATA.EMAILS.ACCOUNTSEMAIL;
        this.BasicDetail.MANAGEREMAIL = response.DATA.CUSTOMERDATA.EMAILS.MANAGEREMAIL;
        this.BasicDetail.TECHNICALEMAIL = response.DATA.CUSTOMERDATA.EMAILS.TECHNICALEMAIL;
        this.BasicDetail.REGISTEREDUNTIL = response.DATA.CUSTOMERDATA.REGISTRATIONGROUP.REGISTEREDUNTIL;
        this.BasicDetail.INTROPRICEUNTIL = response.DATA.CUSTOMERDATA.INTROPRICEUNTIL;
        this.isLoadingResults = false;
      } else {
        this.isLoadingResults = false;
      }
    });
  }

  saveBasicDetail() {
    this.isspiner = true;
    let PostBasicDetail: any = { FormAction: 'update', VALIDATEONLY: true, Data: this.BasicDetail };
    this._mainAPiServiceService.getSetData(PostBasicDetail, 'HOSetCustomerDetails').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.toastr.success('Update successfully');
      } else if (res.CODE == 451 && res.STATUS == 'warning') {
        this.toastr.warning(res.STATUS);
        this.isspiner = false;
      } else if (res.CODE == 450 && res.STATUS == 'error') {
        this.toastr.error(res.STATUS);
        this.isspiner = false;
      }
      // if (res.CODE == 200 && res.STATUS == "success") {
      //   this.checkValidation(res.DATA.VALIDATIONS, PostBasicDetail);
      // } else if (res.CODE == 451 && res.STATUS == 'warning') {
      //   this.checkValidation(res.DATA.VALIDATIONS, PostBasicDetail);
      // } else if (res.CODE == 450 && res.STATUS == 'error') {
      //   this.checkValidation(res.DATA.VALIDATIONS, PostBasicDetail);
      // }
      this.isspiner = false;
    }, err => {
      this.isspiner = false;
      this.toastr.error(err);
    });
  }
  checkValidation(bodyData: any, PostBasicDetail: any) {
    let errorData: any = [];
    let warningData: any = [];
    let tempError: any = [];
    let tempWarning: any = [];
    bodyData.forEach(function (value) {
      if (value.VALUEVALID == 'No') {
        errorData.push(value.ERRORDESCRIPTION);
        tempError[value.FIELDNAME] = value;
      } else if (value.VALUEVALID == 'Warning') {
        tempWarning[value.FIELDNAME] = value;
        warningData.push(value.ERRORDESCRIPTION);
      }
    });
    this.errorWarningData = { "Error": tempError, 'warning': tempWarning };
    if (Object.keys(errorData).length != 0)
      this.toastr.error(errorData);
    if (Object.keys(warningData).length != 0) {
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef = this.MatDialog.open(FuseConfirmDialogComponent, {
        disableClose: true, width: '100%', data: warningData
      });
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.isspiner = true;
          this.saveBasicDetailData(PostBasicDetail);
        }
        this.confirmDialogRef = null;
      });
    }
    if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
      this.saveBasicDetailData(PostBasicDetail);
    this.isspiner = false;
  }
  saveBasicDetailData(PostActivityData: any) {
    PostActivityData.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(PostActivityData, 'HOSetCustomerDetails').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.toastr.success('Update successfully');
      } else if (res.CODE == 451 && res.STATUS == 'warning') {
        this.toastr.warning('Update successfully');
        this.isspiner = false;
      } else if (res.CODE == 450 && res.STATUS == 'error') {
        this.toastr.error(res.STATUS);
        this.isspiner = false;
      }
      this.isspiner = false;
    }, err => {
      this.isspiner = false;
      this.toastr.error(err);
    });
  }
}
