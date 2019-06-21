import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-infotrack',
  templateUrl: './infotrack.component.html',
  styleUrls: ['./infotrack.component.scss']
})
export class InfotrackComponent implements OnInit {

  constructor() { }
  @Input() userForm: FormGroup;
  ngOnInit() {
  }

}
