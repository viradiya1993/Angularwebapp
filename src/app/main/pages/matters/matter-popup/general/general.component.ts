import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { round } from 'lodash';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserSelectPopupComponent } from '../../user-select-popup/user-select-popup.component';
import { MainAPiServiceService, BehaviorService } from 'app/_services';
import { MatterPopupComponent } from '../matter-popup.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  @Input() matterdetailForm: FormGroup;
  //matterdetailForm: FormGroup;
  @Input() userType: any;
  @Input() errorWarningData: any;
  PRICEVAL: any;
  PRICEVALGST: any;
  isDefultMatter: boolean;
  constructor(public datepipe: DatePipe, public MatDialog: MatDialog, 
      public dialogRef: MatDialogRef<MatterPopupComponent>, public behaviorService:BehaviorService,
    private _mainAPiServiceService: MainAPiServiceService, private toastr: ToastrService,) {

      this.behaviorService.MatterNum$.subscribe(result => {
        if(result != null){
         this.CoommonMatterNum();
        }
       });
  }
  CommencementDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['COMMENCEMENTDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }

  CostsAgreementDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['FEEAGREEMENTDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  CompletedDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['COMPLETEDDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  ngOnInit() {
  }
  selectMatter() {
    const dialogRef = this.MatDialog.open(UserSelectPopupComponent, { width: '100%', disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.CoommonMatterNum();
        this.matterdetailForm.controls['OWNERGUID'].setValue(result.USERGUID);
        this.matterdetailForm.controls['OWNERNAME'].setValue(result.FULLNAME);
      }
    });
  }
  CoommonMatterNum(){
    this._mainAPiServiceService.getSetData({ FormAction: 'default', VALIDATEONLY: true, DATA: {} }, 'SetMatter').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        if (res.DATA.DEFAULTVALUES['SHORTNAME'] == "") {
          this.isDefultMatter = false;
        }
        this.matterdetailForm.controls['SHORTNAME'].setValue(res.DATA.DEFAULTVALUES['SHORTNAME']);
      } else if (res.MESSAGE === 'Not logged in') {
        this.dialogRef.close(false);
      } else {
        this.matterdetailForm.controls['SHORTNAME'].setValue(res.DATA.DEFAULTVALUES['SHORTNAME']);
      }
    }, error => { this.toastr.error(error); });

  }
  get f() {
    return this.matterdetailForm.controls;
  }
  selectFeeEarner() {
    const dialogRef = this.MatDialog.open(UserSelectPopupComponent, { width: '100%', disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.CoommonMatterNum();
        this.matterdetailForm.controls['PRIMARYFEEEARNERGUID'].setValue(result.USERGUID);
        this.matterdetailForm.controls['PRIMARYFEEEARNERNAME'].setValue(result.FULLNAME);
      }
    });
  }
  calcPE() {
    this.PRICEVALGST = round(this.f.ESTIMATEFROMTOTALEXGST.value * 1.1).toFixed(2);
  }
  calcPI() {
    this.PRICEVAL = round(this.f.ESTIMATEFROMTOTALINCGST.value / 1.1).toFixed(2);
  }

}
