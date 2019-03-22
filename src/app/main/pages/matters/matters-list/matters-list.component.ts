import { Component, OnDestroy, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation, EventEmitter } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';

import { MattersService } from '../matters.service';

@Component({
  selector: 'app-matters-list',
  templateUrl: './matters-list.component.html',
  styleUrls: ['./matters-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MattersListComponent implements OnInit, OnDestroy {

  mattersData: any;
  displayedColumns = ['name', 'email', 'phone', 'jobTitle', 'buttons'];
  // Private

  @Output() matterDetail: EventEmitter<any> = new EventEmitter<any>();

  constructor(private _mattersService: MattersService, ) { }



  ngOnInit(): void {
    this._mattersService.getMatters().subscribe(response => {
      this.mattersData = response;
      // console.log(response);
    });
  }
  ngOnDestroy(): void { }

  editmatter(matters) {
    this.matterDetail.emit(matters);
  }

}

