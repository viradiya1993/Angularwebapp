import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-defaults',
  templateUrl: './defaults.component.html',
  styleUrls: ['./defaults.component.scss'],
  animations: fuseAnimations
})
export class DefultsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
