import { Component, OnInit, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MainAPiServiceService } from './../../../../_services';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-matter-contact-dailog',
  templateUrl: './matter-contact-dailog.component.html',
  styleUrls: ['./matter-contact-dailog.component.scss'],
  animations: fuseAnimations
})
export class MatterContactDailogComponent implements OnInit {
  displayedColumns: any = ['CONTACTNAME', 'ORDER', 'TYPENAME'];
  matterContactData: any = [];
  isLoadingResults: boolean = false;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  highlightedRows: any;
  currentMatterContactData: any;
  pageSize: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private toastr: ToastrService,  private _mainAPiServiceService: MainAPiServiceService, ) { }

  ngOnInit() {
    this.loadContectData();
  }
  loadContectData() {
    this.isLoadingResults = true;
    let matterSelected = JSON.parse(localStorage.getItem('set_active_matters'));
    
    this._mainAPiServiceService.getSetData({ 'MATTERGUID': matterSelected.MATTERGUID }, 'GetMatterContact').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.matterContactData = new MatTableDataSource(response.DATA.MATTERCONTACTS);
        this.matterContactData.paginator = this.paginator;
        if (Object.keys(response.DATA.MATTERCONTACTS).length != 0) {
          this.currentMatterContactData = response.DATA.MATTERCONTACTS[0];
          this.highlightedRows = response.DATA.MATTERCONTACTS[0].MATTERCONTACTGUID;
          this.matterContactData.sort = this.sort;
          if (response.DATA.queue[0]) {
            this.currentMatterContactData = response.DATA.queue[0];
            this.highlightedRows = response.DATA.queue[0].MATTERCONTACTGUID;
          }
          this.isLoadingResults = false;
        }
      }
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
}
