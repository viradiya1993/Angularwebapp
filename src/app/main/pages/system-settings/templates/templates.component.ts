import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
  animations: fuseAnimations
})
export class TemplatesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
