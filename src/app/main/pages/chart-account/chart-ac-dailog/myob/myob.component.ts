import { Component, OnInit,Input} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-myob',
  templateUrl: './myob.component.html',
  styleUrls: ['./myob.component.scss']
})
export class MyobComponent implements OnInit {
  @Input() AccountForm: FormGroup;
  constructor() { }
  ngOnInit() {
  }

}
