import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  constructor() { }
  @Input() errorWarningData: any;
  @Input() contactForm: FormGroup;
  ngOnInit() {
  }

}
