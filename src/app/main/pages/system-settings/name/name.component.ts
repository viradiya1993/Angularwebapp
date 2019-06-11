import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.scss'],
  animations: fuseAnimations
})
export class NameComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
