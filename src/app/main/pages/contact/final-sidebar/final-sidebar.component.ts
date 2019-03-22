import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-final-sidebar',
  templateUrl: './final-sidebar.component.html',
  styleUrls: ['./final-sidebar.component.scss'],
  animations : fuseAnimations
})
export class FinalSidebarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
