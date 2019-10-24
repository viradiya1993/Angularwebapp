import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatterPopupComponent } from '../matters/matter-popup/matter-popup.component';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, MatDatepickerInputEvent } from '@angular/material';
import { MatterDialogComponent } from '../time-entries/matter-dialog/matter-dialog.component';
import * as $ from 'jquery';
import { MainAPiServiceService, TableColumnsService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-main-searching',
  templateUrl: './main-searching.component.html',
  styleUrls: ['./main-searching.component.scss'],
  animations: fuseAnimations
})
export class MainSearchingComponent implements OnInit {
  MainSearching: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoadingResults: boolean = false;
  addData: any = [];
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  MainSearchingData: any = [];
  ColumnsObj = [];
  pageSize: any;
  displayedColumns: string[];
  tempColobj: any;
  filterData: { 'MATTERGUID': any, 'STATUS': any; 'Search': string; 'OrderedDateFrom': any; 'OrderedDateTo': any, "Matter": any };
  ImgDisAb: string;
  isDisplay: boolean = false;
  constructor(private dialog: MatDialog, private _formBuilder: FormBuilder,
    private _mainAPiServiceService: MainAPiServiceService, private TableColumnsService: TableColumnsService,
    private toastr: ToastrService, public datepipe: DatePipe, ) {
    this.getTableFilter();
  }

  ngOnInit() {
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + $('.sticky_search_div').height() + 80)) + 'px');
    this.MainSearching = this._formBuilder.group({
      matterCheck: [''],
      active: [''],
      status: [''],
      matter: [''],
      DateRange: ['']
    });

    this.filterData = {
      'MATTERGUID': '', 'Search': '', 'OrderedDateFrom': '', 'OrderedDateTo': '', 'STATUS': ' ', "Matter": ''
    }
    //  this.filterData.DUEDATEFROM=new Date();
    //  this.filterData.DUEDATETO=new Date();
    if (!localStorage.getItem("search_filter")) {
      localStorage.setItem('search_filter', JSON.stringify(this.filterData));
    } else {
      this.filterData = JSON.parse(localStorage.getItem("search_filter"));
    }
    this.MainSearching.controls['status'].setValue(this.filterData.STATUS);
    this.MainSearching.controls['matter'].setValue(this.filterData.Matter);
    let date = this.filterData.OrderedDateFrom.split("/");
    let putDate1 = new Date(date[1] + '/' + date[0] + '/' + date[2]);
    let date2 = this.filterData.OrderedDateTo.split("/");
    let putDate2 = new Date(date2[1] + '/' + date2[0] + '/' + date2[2]);
    this.MainSearching.controls['DateRange'].setValue({ begin: putDate1, end: putDate2 });
    if (this.filterData.MATTERGUID == '') {
      this.MainSearching.controls['matterCheck'].setValue(true);
      this.MainSearching.controls['matter'].disable();
      this.CheckboxChecxed();
    } else {
      this.LoadData(this.filterData);
    }

    // this.MainSearching.controls['status'].setValue('all');

  }
  LoadData(data) {
    this.MainSearchingData = [];
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData(data, 'GetCostRecovery').subscribe(res => {
     
      if (res.CODE == 200 && res.STATUS == "success") {
        if (res.DATA.TASKS[0]) {
          this.isDisplay = false;
          // this.behaviorService.TaskData(res.DATA.TASKS[0]);
         this.highlightedRows = res.DATA.TASKS[0].TASKGUID;
        } else {
          this.isDisplay = true;
        }
        this.MainSearchingData = new MatTableDataSource(res.DATA.TASKS);
        this.MainSearchingData.sort = this.sort;
        this.MainSearchingData.paginator = this.paginator;
        this.isLoadingResults = false;
      }
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);

    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('searching', '').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        let data = this.TableColumnsService.filtertableColum(response.DATA.COLUMNS);
        this.tempColobj = data.tempColobj;
        this.displayedColumns = data.showcol;
        this.ColumnsObj = data.colobj;
      }
    }, error => {
      this.toastr.error(error);
    });
  }
  get f() {
    //console.log(this.contactForm);
    return this.MainSearching.controls;
  }
  //   CheckboxChecxed(){
  //     if(this.f.matterCheck.value == true){
  //       this.MainSearching.controls['matter'].disable();
  //     }else{
  //       this.MainSearching.controls['matter'].enable();
  //       const dialogRef = this.dialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: null });
  //       dialogRef.afterClosed().subscribe(result => {

  //           if (result) {
  //               localStorage.setItem('set_active_matters', JSON.stringify(result));
  //               this.MainSearching.controls['matter'].setValue(result.MATTER);      
  //           }
  //           else if (this.f.matter.value==''){
  //             this.MainSearching.controls['matterCheck'].setValue(true);
  //           }
  //       }); 
  //   }
  // }
  CheckboxChecxed() {
    if (this.f.matterCheck.value == true) {
      this.ImgDisAb = "menu-disabled";
      this.MainSearching.controls['matter'].disable();
      this.filterData = JSON.parse(localStorage.getItem("search_filter"));
      this.filterData.MATTERGUID = "";
      localStorage.setItem('search_filter', JSON.stringify(this.filterData));
      this.LoadData(this.filterData);
    } else {
      this.ImgDisAb = "";
      this.MainSearching.controls['matter'].enable();
      const dialogRef = this.dialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: null });
      dialogRef.afterClosed().subscribe(result => {
        if (result != false) {
          if (result) {
            localStorage.setItem('set_active_matters', JSON.stringify(result));
            this.MainSearching.controls['matter'].setValue(result.MATTER);
            this.filterData = JSON.parse(localStorage.getItem("search_filter"));
            this.filterData.MATTERGUID = result.MATTERGUID;
            this.filterData.Matter = result.MATTER;
            localStorage.setItem('search_filter', JSON.stringify(this.filterData));
            this.LoadData(this.filterData);
          }
          else if (this.f.matter.value == '') {
            this.MainSearching.controls['matterCheck'].setValue(true);
          }
        } else {
          this.ImgDisAb = "menu-disabled";
          this.MainSearching.controls['matterCheck'].setValue(true);
          this.MainSearching.controls['matter'].disable();
        }

      });
    }
  }

  SelectMatter() {
    const dialogRef = this.dialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: null });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.MainSearching.controls['matter'].setValue(result.MATTER);
        this.filterData = JSON.parse(localStorage.getItem("search_filter"));
        this.filterData.MATTERGUID = result.MATTERGUID;
        this.filterData.Matter = result.MATTER;
        localStorage.setItem('search_filter', JSON.stringify(this.filterData));
        this.LoadData(this.filterData);
      }
    });
  }
  DateRange1(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value['begin'], 'dd/MM/yyyy');
    let end = this.datepipe.transform(event.value['end'], 'dd/MM/yyyy');
    this.filterData = JSON.parse(localStorage.getItem("search_filter"));
    this.filterData.OrderedDateFrom = begin;
    this.filterData.OrderedDateTo = end;
    localStorage.setItem('search_filter', JSON.stringify(this.filterData));
    this.LoadData(this.filterData);
  }
  DateRange(a, b) {
  }
  selectStatus(val) {
    this.filterData = JSON.parse(localStorage.getItem("search_filter"));
    this.filterData.STATUS = val;
    localStorage.setItem('search_filter', JSON.stringify(this.filterData));
    this.LoadData(this.filterData);
  }
  selectMatterId(){}

}
