import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss']
})
export class OtherComponent implements OnInit {

  common:any;
  selectGender:any;
  constructor() { }
  @Input() loginForm: FormGroup;


  ngOnInit() {
    this.common = [

      { Id: 1, Name: "Male" },
      { Id: 2, Name: "Female" },
      { Id: 3, Name: "Unknown" },

    ];
  }

}
