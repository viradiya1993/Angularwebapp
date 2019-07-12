import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-main-searching',
  templateUrl: './main-searching.component.html',
  styleUrls: ['./main-searching.component.scss'],
  animations: fuseAnimations
})
export class MainSearchingComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  @Input() errorWarningData: any;
  addData:any=[];
  constructor() { }

  ngOnInit() {
   
  }
  
  

}
