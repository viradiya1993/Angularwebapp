import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MainAPiServiceService } from 'app/_services';
import { fuseAnimations } from '@fuse/animations';
import { UserBudgetDialogComponent } from './user-budget-dialog/user-budget-dialog.component';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class UserDialogComponent implements OnInit {
  //START budget related variable 
  USERBUDGETGUIDIndex: number = 1;
  isNewShow: boolean = true;
  highlightedRows: any;
  isLoadingResults: boolean = false;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  userBudgets: any = [];
  tempuserBudgets: any = [];
  currentBudgets: any;
  pageSize: any;
  displayedColumns: string[] = ['PERIODSTART', 'TOTALBUDGETHOURS', 'TOTALBUDGETDOLLARS'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //END budget related variable 
  public userData: any = {
    "USERGUID": "", "USERID": "", "USERNAME": "", "USERPASSWORD": "", "FULLNAME": "", "ISACTIVE": 0,
    "ISPRINCIPAL": 0, "RATEPERHOUR": "0", "RATEPERDAY": "0", "GSTTYPE": 0, "POSITION": "", "PHONE1": "", "PHONE2": "",
    "FAX1": "", "FAX2": "", "MOBILE": "", "EMAIL": "", "PRACTICINGCERTIFICATENO": "",
    "SEARCHUSERNAME": "", "COMMENT": ""
  };
  errorWarningData: any = {};
  userPermissiontemp: any = []
  action: string;
  dialogTitle: string;
  dialogButton: string;
  isspiner = false;
  phide = true;
  public userinfoDatah: any = [];
  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    public confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>,
    public budgetDialogRef: MatDialogRef<UserBudgetDialogComponent>,
    private toastr: ToastrService,
    public _matDialog: MatDialog,
    private _mainAPiServiceService: MainAPiServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.action = data.action;
    if (this.action === 'new') {
      this.dialogTitle = 'New User';
      this.dialogButton = "Add";
    } else if (this.action === 'edit') {
      this.dialogTitle = 'Update User';
      this.dialogButton = "Update";
    } else {
      this.dialogTitle = 'Duplicate User';
      this.dialogButton = "Duplicate";
    }
  }
  ngOnInit(): void {
    if (this.action === 'edit' || this.action === 'duplicate') {
      this.isLoadingResults = true;
      this._mainAPiServiceService.getSetData({ USERGUID: this.data.USERGUID, 'GETALLFIELDS': true }, 'GetUsers').subscribe(response => {
        if (response.CODE === 200 && response.STATUS === 'success') {
          const userinfoData = response.DATA.USERS[0];
          this.setPermissionsCons(userinfoData.PERMISSIONS, 'edit');
          delete userinfoData['PERMISSIONS'];
          this.userData = userinfoData;
        } else if (response.MESSAGE == 'Not logged in') {
          this.dialogRef.close(false);
        }
        this.isLoadingResults = false;
      }, error => {
        this.toastr.error(error);
      });
      this.loadData();
      this.pageSize = localStorage.getItem('lastPageSize');
    } else {
      this.isLoadingResults = true;
      this._mainAPiServiceService.getSetData({ FormAction: 'default', VALIDATEONLY: true, DATA: {} }, 'SetUser').subscribe(res => {
        if (res.CODE == 200 && res.STATUS == "success") {
          this.setPermissionsCons(res.DATA.DEFAULTVALUES.PERMISSIONS, 'add');
        } else if (res.MESSAGE === 'Not logged in') {
          this.dialogRef.close(false);
        }
      }, error => { this.toastr.error(error); });
      setTimeout(() => { this.isLoadingResults = false; }, 2000);
    }
  }
  //start buget
  loadData() {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({ USERGUID: this.userData.USERGUID, 'GETALLFIELDS': true }, 'getUserBudget').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        if (response.DATA.USERBUDGETS[0]) {
          this.highlightedRows = response.DATA.USERBUDGETS[0].USERBUDGETGUID;
          this.currentBudgets = response.DATA.USERBUDGETS[0];
          localStorage.setItem('current_budgets', JSON.stringify(response.DATA.USERBUDGETS[0]));
        }
        this.userBudgets = new MatTableDataSource(response.DATA.USERBUDGETS);
        this.userBudgets.paginator = this.paginator;
        this.userBudgets.sort = this.sort;
        this.isLoadingResults = false;
      } else if (response.MESSAGE == 'Not logged in') {
        this.budgetDialogRef.close(false);
      }
    }, error => {
      console.log(error);
    });
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  // Delete User Budget
  delete_budget(): void {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, { disableClose: true, width: '100%' });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        let budgetsData: any = JSON.parse(localStorage.getItem('current_budgets'));
        if (this.userData.USERGUID != '') {
          let postData = { FormAction: "delete", DATA: { USERBUDGETGUID: budgetsData.USERBUDGETGUID } };
          this._mainAPiServiceService.getSetData(postData, 'SetUserBudget').subscribe(res => {
            if (res.STATUS == "success" && res.CODE == 200) {
              this.toastr.success('Delete successfully');
              this.loadData();
            }
          });
        } else {
          for (var i = 0; i < this.tempuserBudgets.length; i++) {
            if (this.tempuserBudgets[i].USERBUDGETGUID == budgetsData.USERBUDGETGUID) {
              this.tempuserBudgets.splice(i, 1);
              i--;
            }
          }
          this.isNewShow = true;
          this.macktempBudgetDatatable();
        }
      }
      this.confirmDialogRef = null;
    });
  }
  macktempBudgetDatatable() {
    if (this.tempuserBudgets[0]) {
      this.highlightedRows = this.tempuserBudgets[0].USERBUDGETGUID;
      this.currentBudgets = this.tempuserBudgets[0];
      localStorage.setItem('current_budgets', JSON.stringify(this.tempuserBudgets[0]));
      this.userBudgets = new MatTableDataSource(this.tempuserBudgets);
      this.userBudgets.paginator = this.paginator;
      this.userBudgets.sort = this.sort;
    } else {
      this.userBudgets = new MatTableDataSource([]);
      this.userBudgets.paginator = this.paginator;
      this.userBudgets.sort = this.sort;
    }
  }
  budgetDailog(actionType) {
    const budgetDialogRef = this._matDialog.open(UserBudgetDialogComponent, {
      disableClose: true, panelClass: 'UserBudget-dialog', data: { action: actionType, USERGUID: this.userData.USERGUID, USERBUDGETGUIDIndex: this.USERBUDGETGUIDIndex }
    });
    budgetDialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result != true) {
          this.tempuserBudgets.push(result);
          this.USERBUDGETGUIDIndex = this.USERBUDGETGUIDIndex + 1;
          this.macktempBudgetDatatable();
          this.isNewShow = false;
         
        } else
          this.loadData();
      }
    });
  }
  setActiveBudget(val: any) {
    this.currentBudgets = val;
    localStorage.setItem('current_budgets', JSON.stringify(val));
  }
  //END buget
  RatePerHourVal() {
    this.userData.RATEPERHOUR = parseFloat(this.userData.RATEPERHOUR).toFixed(2);
  }
  RatePerDayVal() {
    this.userData.RATEPERDAY = parseFloat(this.userData.RATEPERDAY).toFixed(2);
  }
  setPermissionsCons(tempPermission, type: any) {
    const PermissionsCons = ['MATTER DETAILS', 'DAY BOOK / TIME ENTRIES', 'CONTACTS', 'ESTIMATES', 'DOCUMENT/EMAIL GENERATION', 'DOCUMENT REGISTER', 'INVOICING', 'RECEIVE MONEY', 'SPEND MONEY', 'CHRONOLOGY', 'TOPICS', 'AUTHORITIES', 'FILE NOTES', 'SAFE CUSTODY', 'SAFE CUSTODY PACKET', 'SEARCHING', 'DIARY', 'TASKS', 'CHART OF ACCOUNTS', 'GENERAL JOURNAL', 'OTHER ACCOUNTING', 'TRUST MONEY', 'TRUST CHART OF ACCOUNTS', 'TRUST GENERAL JOURNAL', 'TRUST REPORTS', 'ACCOUNTING REPORTS', 'MANAGEMENT REPORTS', 'SYSTEM', 'USERS', 'ACTIVITIES/SUNDRIES'];
    // const userPermissiontemp: any = [];
    if (tempPermission) {
      PermissionsCons.forEach((value) => {
        if (tempPermission[value]) {
          const subPermissions = [];
          tempPermission[value].forEach((value2) => {
            if (type == "add")
              subPermissions.push({ NAME: value2.NAME, VALUE: false });
            else
              subPermissions.push({ NAME: value2.NAME, VALUE: value2.VALUE == "1" ? true : false });
          });
          this.userPermissiontemp.push({ key: value, val: subPermissions });
        }
      });
    }
    this.userinfoDatah = this.userPermissiontemp;
  }


  getPermissionsCons(permissionsData) {
    const permissionsValue: any = {};
    permissionsData.forEach((value) => {
      const subPermissions = value.val;
      let temp = [];
      subPermissions.forEach((value2) => {
        temp.push({ NAME: value2.NAME, VALUE: value2.VALUE == true ? "1" : "0" });
      });
      permissionsValue[value['key']] = temp;
    });
    return permissionsValue;
  }



  SaveUser() {
    this.isspiner = true;
    if (this.action === 'duplicate') {
      delete this.userData['USERGUID'];
      delete this.userData['STATUS'];
      delete this.userData['ALLOWMOBILEACCESS'];
      delete this.userData['SEARCHUSERPASSWORD'];
    }
    delete this.userData['STATUS'];
    delete this.userData['ALLOWMOBILEACCESS'];
    delete this.userData['SEARCHUSERPASSWORD'];

    const formAction = this.action == 'edit' ? 'update' : 'insert';
    this.userData.PERMISSIONS = this.getPermissionsCons(this.userinfoDatah);
    const userPostData: any = { FormAction: formAction, VALIDATEONLY: true, DATA: this.userData };
    this._mainAPiServiceService.getSetData(userPostData, 'SetUser').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.checkValidation(res.DATA.VALIDATIONS, userPostData);
      } else if (res.CODE == 451 && res.STATUS == 'warning') {
        this.checkValidation(res.DATA.VALIDATIONS, userPostData);
      } else if (res.CODE == 450 && res.STATUS == 'error') {
        this.checkValidation(res.DATA.VALIDATIONS, userPostData);
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
    }, error => {
      this.isspiner = false;
      this.toastr.error(error);
    });
  }
  checkValidation(bodyData: any, details: any): void {
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
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, { disableClose: true, width: '100%', data: warningData });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.SaveUserAfterVAlidation(details);
          this.isspiner = true;
        }
        this.confirmDialogRef = null;
      });
    }
    if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
      this.SaveUserAfterVAlidation(details);
    this.isspiner = false;
  }
  SaveUserAfterVAlidation(data: any) {
    data.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(data, 'SetUser').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        if (Object.keys(this.tempuserBudgets).length == 0) {
          this.toastr.success('User save successfully');
          this.isspiner = false;
          this.dialogRef.close(true);
        } else {
          delete this.tempuserBudgets[0]['USERBUDGETGUID'];
          this.tempuserBudgets[0].USERGUID = response.DATA.USERGUID;
          this.saveBudgetData({ FormAction: 'insert', VALIDATEONLY: false, Data: this.tempuserBudgets[0] });
          this.toastr.success('User save successfully');
          this.isspiner = false;
          this.dialogRef.close(true);
        }
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
  saveBudgetData(PostBudgetData: any) {
    this._mainAPiServiceService.getSetData(PostBudgetData, 'SetUserBudget').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
      }
    }, err => {
      this.toastr.error(err);
    });
  }

  AllCHecked(val, type) {
    this.userinfoDatah.forEach(element => {
      if (element.key === type) {
        element.val.forEach(element2 => {
          element2.VALUE = val.checked;
        });
      }
    });
  }
}
