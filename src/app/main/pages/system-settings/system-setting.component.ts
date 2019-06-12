import { Component, OnInit } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-system-setting',
  templateUrl: './system-setting.component.html',
  styleUrls: ['./system-setting.component.scss'],
  animations: fuseAnimations
})
export class SystemSettingComponent implements OnInit {
  a: string;
  button:string;
  ForDataBind: any;

  constructor(public router: Router) { }

  ngOnInit() {
    // this.button='name';
    this.ForDataBind="Name";
  }
  nameClick(){
  // this.button='name';
  this.ForDataBind="Name";
}
businessClick(){
  // this.button='business';
  this.ForDataBind="Business";
}
defaultsClick(){
  // this.button='defaults';
  this.ForDataBind="Defaults";
}
estimatesClick(){
  // this.button='estimates';
  this.ForDataBind="Estimates";
}
reginoalClick(){
  // this.button='reginoal';
  this.ForDataBind="Reginoal";

}
trustClick(){
  // this.button='trust';
  this.ForDataBind="Trust";
}
templatesClick(){
  // this.button='templates';
  this.ForDataBind="Templates";
}

}
