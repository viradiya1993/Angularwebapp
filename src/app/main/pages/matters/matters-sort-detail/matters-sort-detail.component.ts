import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { isValid } from 'date-fns';
import { TimersService } from '../../../../_services'
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
  theme_type = localStorage.getItem('theme_type');
  contectTitle = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  prevMatterArray: any[] = [];
  constructor(
    private _fuseSidebarService: FuseSidebarService, private toastr: ToastrService, private TimersServiceI: TimersService,
  ) { }

  ngOnInit() {
  }

  closeDetail(event) {
    this.matterCloseD.emit(event);
  }
  addTimeEnrt() {
    this.TimersServiceI.addTimeEnrtS();
  }


}
