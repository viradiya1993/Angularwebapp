import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-write-off-time-entry',
  templateUrl: './write-off-time-entry.component.html',
  styleUrls: ['./write-off-time-entry.component.scss']
})
export class WriteOffTimeEntryComponent implements OnInit {
  isspiner: boolean = false;
  isLoadingResults: boolean = false;
  errorWarningData: any = {};
  constructor() { }

  ngOnInit() {
  }
  saveWriteOffTimeEntry() {

  }
}
