import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-matters',
  templateUrl: './matters.component.html',
  styleUrls: ['./matters.component.scss'],
  animations: fuseAnimations
})
export class MattersComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  
}
