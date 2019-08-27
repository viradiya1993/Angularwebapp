import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent implements OnInit {
  @Input() AccountForm: FormGroup;
  @Input() errorWarningData: any;
  constructor() { }

  ngOnInit() {
  }

}
