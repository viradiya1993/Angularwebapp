import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService, BehaviorService, TimersService } from './../../../../_services';
import * as moment from 'moment';

@Component({
  selector: 'app-resume-timer',
  templateUrl: './resume-timer.component.html',
  styleUrls: ['./resume-timer.component.scss'],
  animations: fuseAnimations
})
export class ResumeTimerComponent implements OnInit {
  resumeTimerForm: FormGroup;
  errorWarningData: any = {};
  timeStops: any = [];
  isLoadingResults: any = false;
  isspiner: any = false;
  buttonText = 'Add';
  calculateData: any = { MatterGuid: '', QuantityType: '', Quantity: '', FeeEarner: '', FeeType: '' };
  constructor(private _mainAPiServiceService: MainAPiServiceService, private behaviorService: BehaviorService, private Timersservice: TimersService) {
    this.timeStops = this.getTimeStops('01:00', '23:59');
  }

  ngOnInit() {
    this.isLoadingResults = true;
    let workerGuid;
    this.behaviorService.workInProgress$.subscribe(workInProgressData => {
      if (workInProgressData) {
        workerGuid = workInProgressData.WORKITEMGUID;
      } else {
        workerGuid = localStorage.getItem('edit_WORKITEMGUID');
      }
    });
    this.Timersservice.getTimeEnrtyData({ 'WorkItemGuid': workerGuid }).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        console.log(response.DATA);
        // this.matterChange('MatterGuid', response.DATA.WORKITEMS[0].MATTERGUID);
        // this.matterChange('QuantityType', response.DATA.WORKITEMS[0].QUANTITYTYPE);
        // this.timeEntryForm.controls['matterautoVal'].setValue(response.DATA.WORKITEMS[0].SHORTNAME);
        // localStorage.setItem('edit_WORKITEMGUID', response.DATA.WORKITEMS[0].WORKITEMGUID);
        // let timeEntryData = response.DATA.WORKITEMS[0];
        // this.itemTypeChange(timeEntryData.ITEMTYPE);
        // if (timeEntryData.ITEMTYPE == "2" || timeEntryData.ITEMTYPE == "3") {
        //   this.timeEntryForm.controls['QUANTITYTYPE'].setValue(timeEntryData.FEETYPE);
        // } else {
        //   this.timeEntryForm.controls['QUANTITYTYPE'].setValue(timeEntryData.QUANTITYTYPE);
        // }
        // this.timeEntryForm.controls['QUANTITY'].setValue(timeEntryData.QUANTITY);
        // this.timeEntryForm.controls['MATTERGUID'].setValue(timeEntryData.MATTERGUID);
        // this.timeEntryForm.controls['ITEMTYPE'].setValue(timeEntryData.ITEMTYPE);
        // let ttyData = moment(timeEntryData.ITEMTIME, 'hh:mm');
        // this.timeEntryForm.controls['ITEMTIME'].setValue(moment(ttyData).format('hh:mm A'));
        // this.timeEntryForm.controls['FEEEARNER'].setValue(timeEntryData.FEEEARNER);

        // let tempDate = timeEntryData.ITEMDATE.split("/");
        // this.ITEMDATEModel = new Date(tempDate[1] + '/' + tempDate[0] + '/' + tempDate[2]);
        // this.timeEntryForm.controls['PRICEINCGST'].setValue(timeEntryData.PRICEINCGST);
        // this.timeEntryForm.controls['PRICE'].setValue(timeEntryData.PRICE);
        // this.timeEntryForm.controls['ADDITIONALTEXT'].setValue(timeEntryData.ADDITIONALTEXT);
        // this.timeEntryForm.controls['ADDITIONALTEXTSELECT'].setValue(timeEntryData.ADDITIONALTEXT);
        // this.timeEntryForm.controls['COMMENT'].setValue(timeEntryData.COMMENT);
      } else if (response.MESSAGE == 'Not logged in') {
        // this.dialogRef.close(false);
      }
      this.isLoadingResults = false;
    }, err => {
      this.isLoadingResults = false;
      // this.toastr.error(err);
    });

  }
  getTimeStops(start, end) {
    const startTime = moment(start, 'HH:mm');
    const endTime = moment(end, 'HH:mm');
    if (endTime.isBefore(startTime)) {
      endTime.add(1, 'day');
    }
    const timeStops = [];
    while (startTime <= endTime) {
      timeStops.push(moment(startTime).format('HH:mm A'));
      startTime.add(15, 'minutes');
    }
    return timeStops;
  }
  matterChange(key: any, event: any) {
    if (key == "MatterGuid") {
      // this.timeEntryForm.controls['MATTERGUID'].setValue(event);
      this.calculateData.MatterGuid = event;
    } else if (key == "FeeEarner") {
      this.calculateData.FeeEarner = event;
    } else if (key == "QuantityType") {
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
          this.calculateData.FeeType = event;
          this.calculateData.QuantityType = 'F';
          break;
        }
      }
    }
    this.calculateData.Quantity = this.f.QUANTITY.value;
    if (this.calculateData.MatterGuid != '' && this.calculateData.Quantity != '' && (this.calculateData.QuantityType != '' || this.calculateData.FeeType != '')) {
      this.isLoadingResults = true;
      this.Timersservice.calculateWorkItems(this.calculateData).subscribe(response => {
        if (response.CODE == 200 && response.STATUS == "success") {
          let CalcWorkItemCharge = response.DATA;
          // this.timeEntryForm.controls['PRICE'].setValue(CalcWorkItemCharge.PRICE);
          // this.timeEntryForm.controls['PRICEINCGST'].setValue(CalcWorkItemCharge.PRICEINCGST);
          this.isLoadingResults = false;
        } else if (response.MESSAGE == 'Not logged in') {
          // this.dialogRef.close(false);
        }
      }, err => {
        this.isLoadingResults = false;
        // this.toastr.error(err);
      });
    }
  }
  get f() {
    return this.resumeTimerForm.controls;
  }




}
