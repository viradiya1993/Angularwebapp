import { Component, OnInit,Input} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  @Input() AccountForm: FormGroup;
  theCheckbox = true;
  constructor() { }
  ngOnInit() {
  }

}
