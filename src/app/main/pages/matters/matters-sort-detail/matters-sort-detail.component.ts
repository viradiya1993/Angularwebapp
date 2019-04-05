import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-matters-sort-detail',
  templateUrl: './matters-sort-detail.component.html',
  styleUrls: ['./matters-sort-detail.component.scss'],
  animations: fuseAnimations
})
export class MattersSortDetailComponent implements OnInit {
  @Input() mattersDetailData;
  @Output() matterCloseD: EventEmitter<any> = new EventEmitter<any>();
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
    let prevMatterArray = JSON.parse(localStorage.getItem("matter_array"));
    if (prevMatterArray.indexOf(activeMatters.SHORTNAME) == -1) {
      $('#sidebar_open_button').click();
    } else {
      this.toastr.error("Matter is already added in timer list");
    }

  }
}
