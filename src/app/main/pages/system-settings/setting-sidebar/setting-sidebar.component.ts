import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-setting-sidebar',
  templateUrl: './setting-sidebar.component.html',
  styleUrls: ['./setting-sidebar.component.scss'],
  animations: fuseAnimations
})
export class SettingSidebarComponent implements OnInit {
    a: string;

  constructor() { }

  ngOnInit() {
  }
  aa(){
    this.a='true';
  }

}
