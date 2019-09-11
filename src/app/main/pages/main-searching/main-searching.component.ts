import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatterPopupComponent } from '../matters/matter-popup/matter-popup.component';
import { MatDialog } from '@angular/material';
import { MatterDialogComponent } from '../time-entries/matter-dialog/matter-dialog.component';
import * as $ from 'jquery';
import { MainAPiServiceService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-main-searching',
  templateUrl: './main-searching.component.html',
  styleUrls: ['./main-searching.component.scss'],
  animations: fuseAnimations
})
export class MainSearchingComponent implements OnInit {
  MainSearching:FormGroup;
  @Input() errorWarningData: any;
  isLoadingResults: boolean = false;
  addData:any=[];
  constructor(private dialog: MatDialog,private _formBuilder: FormBuilder,
  private _mainAPiServiceService: MainAPiServiceService,
  private toastr: ToastrService,) { }

  ngOnInit() {
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + $('.sticky_search_div').height() + 80)) + 'px');
    this.MainSearching = this._formBuilder.group({
      matterCheck: [''],
      active: [''],
      status:[''],
      matter:['']
    
    });
    this.LoadData();
    this.MainSearching.controls['matterCheck'].setValue(true);
    this.MainSearching.controls['status'].setValue('all');
    this.MainSearching.controls['matter'].disable();
  }
  LoadData() {
  
      this.isLoadingResults = true;
      this._mainAPiServiceService.getSetData({}, 'GetCostRecovery').subscribe(res => {
        console.log(res);
        // this.TaskAllData = new MatTableDataSource(res.DATA.TASKS);
        // this.TaskAllData.sort = this.sort;
        // this.TaskAllData.paginator = this.paginator;
        if (res.CODE == 200 && res.STATUS == "success") {
          if (res.DATA.TASKS[0]) {
            // this.behaviorService.TaskData(res.DATA.TASKS[0]);
            // this.highlightedRows = res.DATA.TASKS[0].TASKGUID;
          } else {
            // this.toastr.error("No Data Selected");
          }
          this.isLoadingResults = false;
        }
      }, err => {
        this.isLoadingResults = false;
        this.toastr.error(err);
  
      });
      // this.pageSize = localStorage.getItem('lastPageSize');
    }
  get f() {
    //console.log(this.contactForm);
    return this.MainSearching.controls;
  }
  CheckboxChecxed(){
    if(this.f.matterCheck.value == true){
      this.MainSearching.controls['matter'].disable();
    }else{
      this.MainSearching.controls['matter'].enable();
      const dialogRef = this.dialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: null });
      dialogRef.afterClosed().subscribe(result => {
       
          if (result) {
              localStorage.setItem('set_active_matters', JSON.stringify(result));
              this.MainSearching.controls['matter'].setValue(result.MATTER);      
          }
          else if (this.f.matter.value==''){
            this.MainSearching.controls['matterCheck'].setValue(true);
          }
      }); 
  }
}
  SelectMatter(){
    const dialogRef = this.dialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: null });
      dialogRef.afterClosed().subscribe(result => {
          if (result) {
            
              localStorage.setItem('set_active_matters', JSON.stringify(result));
              this.MainSearching.controls['matter'].setValue(result.MATTER);  
          }
      }); 
//     let mattersData = JSON.parse(localStorage.getItem('set_active_matters'));
//     let MaterPopupData = { action: 'edit', 'matterGuid': mattersData.MATTERGUID }
// //    let contactPopupData = { action:'edit' };
//     const dialogRef = this.dialog.open(MatterPopupComponent, {
//         disableClose: true, panelClass: 'contact-dialog', data: MaterPopupData
//     });
//     dialogRef.afterClosed().subscribe(result => {
//       console.log(result);
//     // this.SearchForm.controls['Matter'].setValue(result);  
//     });
  }
  DateRange(){

  }
DateRange1(){
  
}
}
