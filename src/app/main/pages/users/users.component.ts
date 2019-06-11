import { Component, OnInit } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: fuseAnimations
})
export class UsersComponent implements OnInit {
  a: string;
  button:string;

  constructor() { }

  ngOnInit() {
    this.button='';
  }
 
}
