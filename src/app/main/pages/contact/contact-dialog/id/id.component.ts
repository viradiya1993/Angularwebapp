import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-id',
  templateUrl: './id.component.html',
  styleUrls: ['./id.component.scss']
})
export class IdComponent implements OnInit {

  constructor() { }
  @Input() contactForm: FormGroup;
  @Input() errorWarningData: any;
  ngOnInit() {
  }

}
