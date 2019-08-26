import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MainAPiServiceService, BehaviorService,TableColumnsService } from 'app/_services';
import { MatterPopupComponent } from '../matters/matter-popup/matter-popup.component';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort, MatDialogConfig, MatDatepickerInputEvent } from '@angular/material';
import { MatterDialogComponent } from '../time-entries/matter-dialog/matter-dialog.component';
import { ContactSelectDialogComponent } from '../contact/contact-select-dialog/contact-select-dialog.component';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss'],
    animations: fuseAnimations
})
export class TaskComponent implements OnInit {
    @Input() SettingForm: FormGroup;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
  
    @Input() errorWarningData: any;
    ColumnsObj = [];
    theme_type = localStorage.getItem('theme_type');
     selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
    tempColobj: any;
    pageSize: any;
    GetUSERS:any=[];
    isLoadingResults: boolean = false;
    MainTask: FormGroup;
    TaskAllData:any=[];
    addData: any = [];
    filterData: {'Status':any; 'Search': string; 'UserGuid': any; 'DueDateFrom':any; 'DueDateTo':any,'user':any};
    displayedColumns:any;
    highlightedRows: any;
    constructor(private _mainAPiServiceService: MainAPiServiceService, private dialog: MatDialog,
        private _formBuilder: FormBuilder,public behaviorService:BehaviorService,
        private toastr: ToastrService, private TableColumnsService: TableColumnsService,
        public datepipe: DatePipe,) { }

    ngOnInit() {
        this.getTableFilter();
        this.getUserdata();
        //  this.LoadData();
     $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + $('.sticky_search_div').height() + 70)) + 'px');
    
     this.MainTask = this._formBuilder.group({
            matterCheck: [''],
            active: [''],
            status: [''],
            matter: [''],
            DateRange:[''],
            User: [''],
            search: ['']

        });

        this.filterData = {
          'Search': '', "UserGuid": '','DueDateFrom':'','DueDateTo':'','Status':' ','user':''
         }
         this.filterData.DueDateFrom=new Date();
         this.filterData.DueDateFrom=new Date();
         if(!localStorage.getItem("task_filter")){
           localStorage.setItem('task_filter', JSON.stringify(this.filterData));
         }else{
           this.filterData =JSON.parse(localStorage.getItem("task_filter"));
         }
        //  this.ChartData.AccountClass=this.filterData.AccountClass;
         this.LoadData(this.filterData);

         
        this.MainTask.controls['status'].setValue(this.filterData.Status);
        this.MainTask.controls['User'].setValue(this.filterData.user);

        let date = this.filterData.DueDateFrom.split("/");
        let putDate1 = new Date(date[1] + '/' + date[0] + '/' + date[2]);
        
        let date2 = this.filterData.DueDateTo.split("/");
        let putDate2 = new Date(date2[1] + '/' + date2[0] + '/' + date2[2]);


        this.MainTask.controls['DateRange'].setValue(putDate1,putDate2);

        this.MainTask.controls['matterCheck'].setValue(true);
       
        this.MainTask.controls['matter'].disable();
        // this._mainAPiServiceService.getSetData({}, 'GetSystem').subscribe(response=>{
        //  // console.log(response);
        //   this.addData=response.DATA.SYSTEM.ADDRESSGROUP.POSTALADDRESSGROUP
        // })
    }
    getTableFilter() {
        this.TableColumnsService.getTableFilter('Tasks', '').subscribe(response => {
          console.log(response);
          if (response.CODE == 200 && response.STATUS == "success") {
            let data = this.TableColumnsService.filtertableColum(response.DATA.COLUMNS);
            this.displayedColumns = data.showcol;
            this.ColumnsObj = data.colobj;
            this.tempColobj = data.tempColobj;
          }
        }, error => {
          this.toastr.error(error);
        });
      }
      getUserdata(){
        this._mainAPiServiceService.getSetData({ 'Active': 'yes' }, 'GetUsers').subscribe(response => {
        if (response.CODE === 200 && (response.STATUS === "OK" || response.STATUS === "success")) {
          console.log(response);
          this.GetUSERS=response.DATA.USERS;
        }
      });
      }
    LoadData(data){
        this.isLoadingResults=true;
        this._mainAPiServiceService.getSetData(data, 'GetTask').subscribe(res => {
            console.log(res);
          if (res.CODE == 200 && res.STATUS == "success") {
            if (res.DATA.TASKS[0]) {
              this.behaviorService.TaskData(res.DATA.TASKS[0]);
              this.TaskAllData = new MatTableDataSource(res.DATA.TASKS);
              this.TaskAllData.sort = this.sort;
              this.TaskAllData.paginator = this.paginator;
              this.highlightedRows=res.DATA.TASKS[0].TASKGUID;
  
            } else {
              // this.toastr.error("No Data Selected");
            }
            this.isLoadingResults=false;
          }
        }, err => {
          this.isLoadingResults=false;
          this.toastr.error(err);
    
        });
        this.pageSize = localStorage.getItem('lastPageSize');
      }
    get f() {
        //console.log(this.contactForm);
        return this.MainTask.controls;
    }
    CheckboxChecxed() {
        if (this.f.matterCheck.value == true) {
            this.MainTask.controls['matter'].disable();
        } else {
            this.MainTask.controls['matter'].enable();
            const dialogRef = this.dialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: null });
            dialogRef.afterClosed().subscribe(result => {

                if (result) {
                    localStorage.setItem('set_active_matters', JSON.stringify(result));
                    this.MainTask.controls['matter'].setValue(result.MATTER);
                }
                else if (this.f.matter.value == '') {
                    this.MainTask.controls['matterCheck'].setValue(true);
                }
            });
        }
    }
    SelectMatter() {
        const dialogRef = this.dialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: null });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
            }
        });
    }
    onPaginateChange(event) {
      this.pageSize = event.pageSize;
      localStorage.setItem('lastPageSize', event.pageSize);
    }
    openDialog() {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '100%';
      dialogConfig.disableClose = true;
      dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'Tasks', 'list': '' };
      //open pop-up
      const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.tempColobj = result.tempColobj;
          this.displayedColumns = result.columObj;
          this.ColumnsObj = result.columnameObj;
          if (!result.columObj) {
            this.TaskAllData = new MatTableDataSource([]);
            this.TaskAllData.paginator = this.paginator;
            this.TaskAllData.sort = this.sort;
          } else {
            this.filterData =JSON.parse(localStorage.getItem("task_filter"));
            this.LoadData({});
          }
        }
      });
    }
    selectUsers(value){
      console.log(value)
      this.filterData =JSON.parse(localStorage.getItem("task_filter"));
      this.filterData.UserGuid = value;
      this.filterData.user = value.USERNAME;
      localStorage.setItem('task_filter', JSON.stringify(this.filterData));
      this.LoadData(this.filterData);
    }
    selectStatus(val){
      // console.log(val)
      this.filterData =JSON.parse(localStorage.getItem("task_filter"));
      this.filterData.Status = val.USERGUID;
      localStorage.setItem('task_filter', JSON.stringify(this.filterData));
      this.LoadData(this.filterData);




    }
    DateRange1(type: string, event: MatDatepickerInputEvent<Date>) {
      let begin = this.datepipe.transform(event.value['begin'], 'dd/MM/yyyy');
      let end = this.datepipe.transform(event.value['end'], 'dd/MM/yyyy');
      this.filterData =JSON.parse(localStorage.getItem("task_filter"));
      this.filterData.DueDateFrom = begin;
      this.filterData.DueDateTo = end;
      localStorage.setItem('task_filter', JSON.stringify(this.filterData));
      this.LoadData(this.filterData);
  
    }
    DateRange(a, b) {
    }
    onSearch(searchFilter: any) {
      this.filterData =JSON.parse(localStorage.getItem("task_filter"));
      if (searchFilter['key'] === "Enter" || searchFilter == 'Enter') {
         this.filterData.Search = this.f.searchFilter.value;
        localStorage.setItem('task_filter', JSON.stringify(this.filterData));
        this.LoadData(this.filterData);
        // let filterVal = { 'Active': '', 'SearchString': this.f.searchFilter.value, 'FeeEarner': '', 'UninvoicedWork': '' };
        // if (!localStorage.getItem('matter_filter')) {
        //   // localStorage.setItem('matter_filter', JSON.stringify(filterVal));
        // } else {
        //   filterVal = JSON.parse(localStorage.getItem('matter_filter'));
        //   filterVal.SearchString = this.f.searchFilter.value;
        //   // localStorage.setItem('matter_filter', JSON.stringify(filterVal));
        // }
        // this.child.getMatterList(filterVal);
      }
  
    }
    refreshTask(){
      this.LoadData({});
    }
    RowClick(row){
      this.behaviorService.TaskData(row);
    }
}
