import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-compulsory-acquisition',
  templateUrl: './compulsory-acquisition.component.html',
  styleUrls: ['./compulsory-acquisition.component.scss']
})
export class CompulsoryAcquisitionComponent implements OnInit {

  constructor() { }

  @Input() matterdetailForm: FormGroup;
  ngOnInit() {
  }

}
