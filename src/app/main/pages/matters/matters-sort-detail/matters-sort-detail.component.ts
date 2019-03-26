import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-matters-sort-detail',
  templateUrl: './matters-sort-detail.component.html',
  styleUrls: ['./matters-sort-detail.component.scss'],
  animations: fuseAnimations
})
export class MattersSortDetailComponent implements OnInit {
  @Input() mattersDetailData;
  @Output() matterCloseD: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  closeDetail(event) {
    this.matterCloseD.emit(event);
  }

}
