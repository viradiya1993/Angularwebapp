import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-correspond-dailog',
  templateUrl: './correspond-dailog.component.html',
  styleUrls: ['./correspond-dailog.component.scss']
})
export class CorrespondDailogComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder, ) { }
  correspondForm: FormGroup;
  ngOnInit() {
    this.correspondForm = this._formBuilder.group({
      ContactType: [''],
      ContactName: [''],
      SolicitorName: [''],
      Reference: ['']
    });
  }

}
