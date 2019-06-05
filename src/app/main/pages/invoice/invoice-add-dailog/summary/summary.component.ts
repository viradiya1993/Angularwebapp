import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  @Input() addInvoiceForm: FormGroup;
  @Input() isMax: any;
  @Input() isMin: any;
  @Input() isFixPrice: any;
  constructor() { }
  ngOnInit() {
  }

}
