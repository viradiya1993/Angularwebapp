import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-discount-increase',
  templateUrl: './discount-increase.component.html',
  styleUrls: ['./discount-increase.component.scss']
})
export class DiscountIncreaseComponent implements OnInit {
  @Input() addInvoiceForm: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
