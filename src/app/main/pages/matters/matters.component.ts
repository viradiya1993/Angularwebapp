import { Component, OnInit, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import * as $ from 'jquery';
import { TimersService } from '../../../_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MattersListComponent } from './matters-list/matters-list.component';

@Component({
  selector: 'app-matters',
  templateUrl: './matters.component.html',
  styleUrls: ['./matters.component.scss'],
  animations: fuseAnimations,
})
export class MattersComponent implements OnInit {
  @ViewChild(MattersListComponent) child: MattersListComponent;
  matterFilterForm: FormGroup;
  mattersDetail: any;
  detailHeight: any;
  isShowDrop: boolean = false;
  MatterDropData: any;
  lastFilter: any;


  constructor(private Timersservice: TimersService, fb: FormBuilder) {
    let theme_type = localStorage.getItem('theme_type');
    if (theme_type != "theme-default") {
      $('body').addClass('theme-yellow-light').removeClass("theme-default");
    } else {
      $('body').addClass('theme-default').removeClass("theme-yellow-light");
    }
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.isShowDrop = currentUser.ProductType == "Barrister" ? false : true;
    this.getDropValue();
    this.lastFilter = JSON.parse(localStorage.getItem('matter_filter'));
    if (this.lastFilter) {
      this.lastFilter = { 'Active': '', 'SearchString': '', 'FeeEarner': '' };
      this.matterFilterForm = fb.group({
        MatterFilter: [this.lastFilter.Active],
        UserFilter: [this.lastFilter.FeeEarner],
        InvoiceFilter: [],
        searchFilter: [],
      });
    }
  }
  MatterChange(value) {
    let filterVal = { 'Active': value, 'SearchString': '', 'FeeEarner': '' };
    if (!localStorage.getItem('matter_filter')) {
      localStorage.setItem('matter_filter', JSON.stringify(filterVal));
    } else {
      filterVal = JSON.parse(localStorage.getItem('matter_filter'));
      filterVal.Active = value;
      localStorage.setItem('matter_filter', JSON.stringify(filterVal));
    }
    this.child.getMatterList(filterVal);
  }
  MatterUserChange(value) {
    let filterVal = { 'Active': '', 'SearchString': '', 'FeeEarner': value };
    if (!localStorage.getItem('matter_filter')) {
      localStorage.setItem('matter_filter', JSON.stringify(filterVal));
    } else {
      filterVal = JSON.parse(localStorage.getItem('matter_filter'));
      filterVal.FeeEarner = value;
      localStorage.setItem('matter_filter', JSON.stringify(filterVal));
    }
    this.child.getMatterList(filterVal);
  }
  onSearch(searchFilter: any, searchFilter2: any) {
    if (searchFilter['key'] === "Enter") {
      let filterVal = { 'Active': '', 'SearchString': searchFilter2.value, 'FeeEarner': '' };
      if (!localStorage.getItem('matter_filter')) {
        localStorage.setItem('matter_filter', JSON.stringify(filterVal));
      } else {
        filterVal = JSON.parse(localStorage.getItem('matter_filter'));
        filterVal.SearchString = searchFilter2.value;
        localStorage.setItem('matter_filter', JSON.stringify(filterVal));
      }
      this.child.getMatterList(filterVal);
    }
  }

  ngOnInit() { }
  getDropValue() {
    let d = {};
    this.Timersservice.GetUsers(d).subscribe(res => {
      if (res.Users.response != "error - not logged in") {
        localStorage.setItem('session_token', res.Users.SessionToken);
        this.MatterDropData = res.Users.DataSet;
      }
    }, err => {
      console.log(err);
    });
  }
  matterBack(event: any) {
    this.mattersDetail = event;
    localStorage.setItem('set_active_matters', JSON.stringify(this.mattersDetail));
    let windowHeight = $(window).height();
    let toolBaarMain = $('#tool_baar_main').height();
    let serchHeight = $('.sticky_search_div').height();
    this.detailHeight = windowHeight - (toolBaarMain + serchHeight) + 'px';
  }
  matterClose(event: any) {
    this.mattersDetail = '';
  }

}
