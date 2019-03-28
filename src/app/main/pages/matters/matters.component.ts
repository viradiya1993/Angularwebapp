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
  constructor() { }

  ngOnInit() { }

  matterBack(event: any) {
    this.mattersDetail = event;
    let windowHeight = $(window).height();
    let toolBaarMain = $('#tool_baar_main').height();
    let serchHeight = $('.sticky_search_div').height();
    let detailHeight = windowHeight - (toolBaarMain + serchHeight);
    $('#matters.list_sidebar_right_child').css({ 'height': detailHeight + 'px !important' });
  }
  matterClose(event: any) {
    this.mattersDetail = '';
  }

}
