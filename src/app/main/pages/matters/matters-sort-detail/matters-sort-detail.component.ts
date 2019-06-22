import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { isValid } from 'date-fns';
import { TimersService, MattersService } from '../../../../_services'
import { MatterPopupComponent } from '../matter-popup/matter-popup.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
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
    private _fuseSidebarService: FuseSidebarService,
    private toastr: ToastrService,
    private TimersServiceI: TimersService,
    public dialog: MatDialog,
    private _mattersService: MattersService,
  ) { }

  ngOnInit() { }

  closeDetail(event) {
    this.matterCloseD.emit(event);
  }
  addTimeEnrt() {
    this.TimersServiceI.addTimeEnrtS();
  }
  AddNewmatterpopup() {
    const dialogConfig = new MatDialogConfig();
    let mattersData = JSON.parse(localStorage.getItem('set_active_matters'));
    const dialogRef = this.dialog.open(MatterPopupComponent, {
      width: '100%',
      disableClose: true,
      data: { action: 'edit', 'matterGuid': mattersData.MATTERGUID }
    });
    dialogRef.afterClosed().subscribe(result => { });
  }


}
