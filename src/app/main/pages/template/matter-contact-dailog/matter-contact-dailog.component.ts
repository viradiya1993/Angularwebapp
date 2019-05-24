import { Component, OnInit, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MattersService, } from './../../../../_services';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { MatPaginator, MatTableDataSource } from '@angular/material';

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
  constructor(private toastr: ToastrService, public mattersService: MattersService) { }

  ngOnInit() {
    this.loadContectData();
  }
  loadContectData() {
    this.isLoadingResults = true;
    let matterSelected = JSON.parse(localStorage.getItem('set_active_matters'));
    this.mattersService.getMattersContact({ 'MATTERGUID': matterSelected.MATTERGUID }).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.matterContactData = new MatTableDataSource(response.DATA.queue);
        this.matterContactData.paginator = this.paginator;
        if (response.DATA.queue[0]) {
          this.currentMatterContactData = response.DATA.queue[0];
          this.highlightedRows = response.DATA.queue[0].MATTERCONTACTGUID;
        }
        this.isLoadingResults = false;
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
