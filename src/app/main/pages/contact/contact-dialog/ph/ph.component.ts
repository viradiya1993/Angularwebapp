import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ph',
  templateUrl: './ph.component.html',
  styleUrls: ['./ph.component.scss']
})
export class PhComponent implements OnInit {

  constructor() { }
  @Input() contactForm: FormGroup;
  @Input() errorWarningData: any;

  ngOnInit() {
  }

}
