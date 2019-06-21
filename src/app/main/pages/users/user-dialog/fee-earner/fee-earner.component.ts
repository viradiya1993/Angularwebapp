import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fee-earner',
  templateUrl: './fee-earner.component.html',
  styleUrls: ['./fee-earner.component.scss']
})
export class FeeEarnerComponent implements OnInit {

  constructor() { }
  @Input() userForm: FormGroup;
  ngOnInit() {
    
  }

}
