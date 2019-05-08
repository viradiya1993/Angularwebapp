import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-matter-popup',
  templateUrl: './matter-popup.component.html',
  styleUrls: ['./matter-popup.component.scss']
})
export class MatterPopupComponent implements OnInit {
  Classdata: any [];

  constructor() { }

// tslint:disable-next-line: typedef
  ngOnInit() {
    this.Classdata = [
      { name: 'General' , value: 'General' },
      { name: 'General1' , value: 'General1' },
      { name: 'General2' , value: 'General2' },
      { name: 'General3' , value: 'General3' },
    ];
  }
  

}
