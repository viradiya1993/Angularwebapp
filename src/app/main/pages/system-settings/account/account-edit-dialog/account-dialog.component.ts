import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { SystemSetting } from '../../../../../_services';

@Component({
  selector: 'app-account-dialog',
  templateUrl: './account-dialog.component.html',
  styleUrls: ['./account-dialog.component.scss'],
  animations: fuseAnimations
})
export class AccountDialogComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  @Input() errorWarningData: any;
  addData:any=[];
  constructor(private SystemSetting:SystemSetting) { }

  ngOnInit() {
    
    
  }
  


}
