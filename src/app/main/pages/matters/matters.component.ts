import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import * as $ from 'jquery';
import { TimersService, BehaviorService } from '../../../_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MattersListComponent } from './matters-list/matters-list.component';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-matters',
  templateUrl: './matters.component.html',
  styleUrls: ['./matters.component.scss'],
  animations: fuseAnimations,
})
export class MattersComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  @ViewChild(MattersListComponent,{static: false}) child: MattersListComponent;
  matterFilterForm: FormGroup;
  mattersDetail: any;
  detailHeight: any;
  isShowDrop: boolean = false;
  MatterDropData: any;
  lastFilter: any;


  constructor(private Timersservice: TimersService, private fb: FormBuilder, private cd: ChangeDetectorRef, private behaviorService: BehaviorService) {
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
    this.matterFilterForm = this.fb.group({ MatterFilter: [''], UserFilter: [''], searchFilter: [''], InvoiceFilter: [''], });
    if (this.lastFilter) {
      this.matterFilterForm.controls['MatterFilter'].setValue(this.lastFilter.Active);
      this.matterFilterForm.controls['UserFilter'].setValue(this.lastFilter.FeeEarner);
      // this.matterFilterForm.controls['searchFilter'].setValue(this.lastFilter.SearchString);
      this.matterFilterForm.controls['InvoiceFilter'].setValue(this.lastFilter.UninvoicedWork);
    } else {
      this.matterFilterForm.controls['MatterFilter'].setValue('active');
      this.matterFilterForm.controls['InvoiceFilter'].setValue('All');
    }
  }
  MatterChange(value) {
    let filterVal: any = { 'Active': value, 'FeeEarner': '', 'UninvoicedWork': '' };
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
    let filterVal: any = { 'Active': '', 'FeeEarner': value, 'UninvoicedWork': '' };
    if (!localStorage.getItem('matter_filter')) {
      localStorage.setItem('matter_filter', JSON.stringify(filterVal));
    } else {
      filterVal = JSON.parse(localStorage.getItem('matter_filter'));
      filterVal.FeeEarner = value;
      localStorage.setItem('matter_filter', JSON.stringify(filterVal));
    }
    this.child.getMatterList(filterVal);
  }
  MatterInvoiceChange(value) {
    let filterVal: any = { 'Active': '', 'FeeEarner': '', 'UninvoicedWork': value };
    if (!localStorage.getItem('matter_filter')) {
      localStorage.setItem('matter_filter', JSON.stringify(filterVal));
    } else {
      filterVal = JSON.parse(localStorage.getItem('matter_filter'));
      filterVal.UninvoicedWork = value;
      localStorage.setItem('matter_filter', JSON.stringify(filterVal));
    }
    this.child.getMatterList(filterVal);
  }
  get f() {
    return this.matterFilterForm.controls;
  }
  onSearch(searchFilter: any) {
    if (searchFilter['key'] === "Enter" || searchFilter == 'Enter') {
      let filterVal = { 'Active': '', 'SearchString': this.f.searchFilter.value, 'FeeEarner': '', 'UninvoicedWork': '' };
      if (!localStorage.getItem('matter_filter')) {
        // localStorage.setItem('matter_filter', JSON.stringify(filterVal));
      } else {
        filterVal = JSON.parse(localStorage.getItem('matter_filter'));
        filterVal.SearchString = this.f.searchFilter.value;
        // localStorage.setItem('matter_filter', JSON.stringify(filterVal));
      }
      this.child.getMatterList(filterVal);
    }
  }

  ngOnInit() {
    if (!this.lastFilter) {
      localStorage.setItem('matter_filter', JSON.stringify({ 'Active': 'active', 'SearchString': '', 'FeeEarner': '', 'UninvoicedWork': 'All' }));
      this.child.getMatterList({ 'Active': 'active', 'SearchString': '', 'FeeEarner': '', 'UninvoicedWork': 'All' });
    }
    this.behaviorService.resizeTableForAllView();
    const behaviorService = this.behaviorService;
    $(window).resize(function () {
      behaviorService.resizeTableForAllView();
    });
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }
  getDropValue() {
    let d = {};
    this.Timersservice.GetUsers(d).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.MatterDropData = response.DATA.USERS;
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
    this.detailHeight = windowHeight - (toolBaarMain + serchHeight + 40) + 'px';
  }
  matterClose(event: any) {
    this.mattersDetail = '';
  }
  ngOnDestroy(): void {
    // let filterVal = JSON.parse(localStorage.getItem('matter_filter'));
    // filterVal.SearchString = '';
    // localStorage.setItem('matter_filter', JSON.stringify(filterVal));
  }
}
