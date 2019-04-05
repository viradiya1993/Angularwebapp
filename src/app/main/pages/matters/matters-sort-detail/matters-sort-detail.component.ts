import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { isValid } from 'date-fns';

@Component({
  selector: 'app-matters-sort-detail',
  templateUrl: './matters-sort-detail.component.html',
  styleUrls: ['./matters-sort-detail.component.scss'],
  animations: fuseAnimations
})
export class MattersSortDetailComponent implements OnInit {
  @Input() mattersDetailData;
  @Output() matterCloseD: EventEmitter<any> = new EventEmitter<any>();
  currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
  timerId: any = 'timer_' + this.currentUser.UserGuid;
  prevMatterArray: any[] = [];
  constructor(
    private _fuseSidebarService: FuseSidebarService, private toastr: ToastrService
  ) { }

  ngOnInit() {
  }

  closeDetail(event) {
    this.matterCloseD.emit(event);
  }
  addTimeEnrt() {
    let activeMatters = JSON.parse(localStorage.getItem('set_active_matters'));
    if (activeMatters.ACTIVE == 0) {
      this.toastr.error("You cannot start timer for Inactive matter. Please select active matter and try again.");
      return false;
    }
    this.prevMatterArray = JSON.parse(localStorage.getItem(this.timerId));
    if (this.prevMatterArray) {
      if (this.containsObject(activeMatters.SHORTNAME)) {
        this.addNewTimer();
        $('#sidebar_open_button').click();
      } else {
        this.toastr.error("Matter is already added in timer list");
      }
    } else {
      this.addNewTimer();
      $('#sidebar_open_button').click();
    }
  }
  containsObject(obj) {
    let isValid = true;
    this.prevMatterArray.forEach(items => {
      if (items.matter_id === obj)
        isValid = false;
    });
    return isValid;
  }
  addNewTimer() {
    let activeMatters = JSON.parse(localStorage.getItem('set_active_matters'));
    /*When add first matter in local storage. Matter array null for first time*/
    if (!localStorage.getItem(this.timerId)) {
      let matterArry = [];
      matterArry.push({ 'matter_id': activeMatters.SHORTNAME, 'time': 0, 'isStart': true });
      localStorage.setItem(this.timerId, JSON.stringify(matterArry));
      this.toastr.success("Timer is added for selected matter");
    } else {
      let demoTimer: any[] = [];
      this.prevMatterArray.forEach(items => {
        let startTimer: any = localStorage.getItem('start_' + items.matter_id);
        if (startTimer) {
          demoTimer.push({ 'matter_id': items.matter_id, 'time': startTimer, 'isStart': false });
          localStorage.removeItem('start_' + items.matter_id);
        } else {
          demoTimer.push({ 'matter_id': items.matter_id, 'time': items.time, 'isStart': false });
        }
      });
      demoTimer.push({ 'matter_id': activeMatters.SHORTNAME, 'time': 0, 'isStart': true });
      localStorage.setItem(this.timerId, JSON.stringify(demoTimer));
    }
    let timeD: any = 0;
    localStorage.setItem('start_' + activeMatters.SHORTNAME, timeD);
  }
}
