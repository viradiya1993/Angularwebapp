import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-discount-increase',
  templateUrl: './discount-increase.component.html',
  styleUrls: ['./discount-increase.component.scss']
})
export class DiscountIncreaseComponent implements OnInit {
  @Input() addInvoiceForm: FormGroup;
  @Output() discountAmount: EventEmitter<any> = new EventEmitter<any>();
  isAmount: boolean = true;
  constructor() { }

  ngOnInit() {
    this.addInvoiceForm.controls['Percentage_type'].setValue('Percentage');
    this.addInvoiceForm.controls['Percentage'].setValue(0);
    this.addInvoiceForm.controls['Discount_type'].setValue('Discount');
    this.addInvoiceForm.controls['GST_type'].setValue('IncGstAmount');
    this.addInvoiceForm.controls['amount'].setValue(0);
    this.onAmoPerChnage('Enter');
  }
  get f() {
    return this.addInvoiceForm.controls;
  }
  PercentageTypeChange(val) {
    this.isAmount = val == "Percentage" ? true : false;
    if (this.isAmount)
      this.addInvoiceForm.controls['amount'].setValue(0);
    else
      this.addInvoiceForm.controls['Percentage'].setValue(0);
    this.onAmoPerChnage('Enter');
  }
  DiscountTypeChange() {
    this.onAmoPerChnage('Enter');
  }
  onAmoPerChnage(searchFilter = "") {
    if (searchFilter['code'] == "Enter" || searchFilter == "Enter") {
      this.discountAmount.emit({ 'amount': this.f.amount.value, 'Percentage': this.f.Percentage.value, 'Percentage_type': this.f.Percentage_type.value, 'GST_type': this.f.GST_type.value, 'Discount_type': this.f.Discount_type.value });
    }
  }

}
