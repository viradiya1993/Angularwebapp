import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { AccountDialogComponent } from './account-edit-dialog/account-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MainAPiServiceService, BehaviorService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  animations: fuseAnimations
})

export class AccountComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: false}) sort: MatSort;
  highlightedRows: any;
  isLoadingResults: boolean = false;
  accountData: any = [];
  pageSize: any;
  PassArray: any = [];
  FinalList: any = [];
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  contectTitle = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  displayedColumns: string[] = ['ACCOUNTNO', 'DESCRIPTION', 'ACCOUNTTYPE', 'ACCOUNTGUIDNAME', 'ACCOUNTNAME'];
  INDEX: any;
  constructor(public dialog: MatDialog, private _mainAPiServiceService: MainAPiServiceService,
    private toastr: ToastrService, public behaviorService: BehaviorService) { }
  ngOnInit() {
    this.LoadData({});
  }
  LoadData(data) {
    // this.TaskAllData=[];
    // this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData(data, 'GetSystem').subscribe(res => {
      res.DATA.LISTS.SYSTEMACCOUNTS.forEach(element => {
        this.FinalList.push(element)
      });
      this.FinalList = new MatTableDataSource(res.DATA.LISTS.SYSTEMACCOUNTS);
      this.FinalList.sort = this.sort;
      this.FinalList.paginator = this.paginator;
      // this.behaviorService.SysytemAccountData(this.FinalList.data);
      if (res.CODE == 200 && res.STATUS == "success") {
        if (res.DATA.LISTS.SYSTEMACCOUNTS[0]) {
          this.accountrow(res.DATA.LISTS.SYSTEMACCOUNTS[0], 0)
          this.behaviorService.SysytemAccountData(res.DATA.LISTS.SYSTEMACCOUNTS);
          this.highlightedRows = 0;
          this.behaviorService.loadingSystemSetting('account');
        } else {
          // this.toastr.error("No Data Selected");
        }
        // this.isLoadingResults = false;
      }
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);

    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  ondialogClick() {
    const dialogRef = this.dialog.open(AccountDialogComponent, {
      disableClose: true,
      panelClass: '',
      data: {
        action: '',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.length > 0) {
        this.FinalList.data[this.INDEX].ACCOUNTNAME = result[0].ACCOUNTNAME;
        this.FinalList.data[this.INDEX].ACCOUNTNO = result[0].ACCOUNTNUMBER;
        this.FinalList.data[this.INDEX].ACCOUNTGUID = result[0].ACCOUNTGUID
      }
      // console.log(this.FinalList.data[this.INDEX]);
      //  this.PassArray.push(this.FinalList.data);
      this.behaviorService.SysytemAccountData(this.FinalList.data);
    });
  }
  accountrow(val, index) {
    this.INDEX = index;
    this.behaviorService.SysytemAccountDIalogData(val);
  }
  save() {
    // let data1 = { FormAction: "update", VALIDATEONLY: true, Data:this.FinalList.data[this.INDEX] }
    // this._mainAPiServiceService.getSetData(data1, 'SetSystem').subscribe(response=>{
    //  console.log(response);
    //   // this.getDropDownValue=response.DATA.LISTS;

    //   // this.getMatterClass(response);

    //    })
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }

}
