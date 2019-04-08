import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import * as $ from 'jquery';

@Component({
  selector: 'app-matters',
  templateUrl: './matters.component.html',
  styleUrls: ['./matters.component.scss'],
  animations: fuseAnimations
})
export class MattersComponent implements OnInit {
  mattersDetail: any;
  detailHeight: any;
  constructor() {
    let theme_type = localStorage.getItem('theme_type');
    if (theme_type != "theme-default") {
      $('body').addClass('theme-yellow-light').removeClass("theme-default");
    } else {
      $('body').addClass('theme-default').removeClass("theme-yellow-light");
    }
  }

  ngOnInit() { }

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
