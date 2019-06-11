import { Component, OnInit } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-system-setting',
  templateUrl: './system-setting.component.html',
  styleUrls: ['./system-setting.component.scss'],
  animations: fuseAnimations
})
export class SystemSettingComponent implements OnInit {
  a: string;
  button:string;

  constructor() { }

  ngOnInit() {
    this.button='';
  }
  nameClick(){
  this.button='name';
}
businessClick(){
  this.button='business';
}
defaultsClick(){
  this.button='defaults';
}
}
