import { Component, OnInit,Input} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-xero',
  templateUrl: './xero.component.html',
  styleUrls: ['./xero.component.scss']
})
export class XeroComponent implements OnInit {
  @Input() AccountForm: FormGroup;
  constructor() { }
  ngOnInit() {
  }

}
