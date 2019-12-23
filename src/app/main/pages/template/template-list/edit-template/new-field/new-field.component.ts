import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService } from 'app/_services';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-new-field',
  templateUrl: './new-field.component.html',
  styleUrls: ['./new-field.component.scss'],
  animations: fuseAnimations
})
export class NewFieldComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  @Input() errorWarningData: any;
  addData: any = [];
  VarValue: string;
  constructor(private _mainAPiServiceService: MainAPiServiceService,
    public dialogRef: MatDialogRef<NewFieldComponent>) { }

  ngOnInit() {
    // this._mainAPiServiceService.getSetData({}, 'GetSystem').subscribe(response=>{
    //  // console.log(response);
    //   this.addData=response.DATA.SYSTEM.ADDRESSGROUP.POSTALADDRESSGROUP
    // })

  }
  choosedDate() {

  }
  onChangeFieldType(val) {
    if (val == 'Calculated Field') {
      this.VarValue = "CalculatedF"
    }
  }
  closepopup() {
    this.dialogRef.close(false);
  }

}
