import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService, BehaviorService } from './../../../../_services';
import { MatDialog } from '@angular/material/dialog';
import { GenerateTemplatesDialoagComponent } from './gennerate-template-dialoag/generate-template.component';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
  animations: fuseAnimations
})
export class TemplatesComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  @Input() errorWarningData: any;
  getTemplateArray: any = [];
  options: string[] = ['One', 'Two', 'Three'];
  getDropDownValue: any = [];
  abc: any;
  a: string;
  constructor(private _mainAPiServiceService: MainAPiServiceService, public dialog: MatDialog,
    private behaviorService:BehaviorService) { }

  ngOnInit() {
    this._mainAPiServiceService.getSetData({}, 'GetSystem').subscribe(response => {
      this.getDropDownValue = response.DATA.LISTS;
      this.behaviorService.loadingSystemSetting('templete');

    })
  }

  SelectDocument() {

    const dialogRef = this.dialog.open(GenerateTemplatesDialoagComponent, {
      disableClose: true,
      panelClass: 'contact-dialog',
      data: {
        action: 'new',
      }
    });
    dialogRef.afterClosed().subscribe(result => {

      this.SettingForm.controls['INVOICETEMPLATE'].setValue(result);

    });
  }
  SelectReceiptDocument() {
    const dialogRef = this.dialog.open(GenerateTemplatesDialoagComponent, {
      disableClose: true,
      panelClass: 'contact-dialog',
      data: {
        action: 'new',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.abc=result;
      this.SettingForm.controls['RECEIPTTEMPLATE'].setValue(result);


    });
  }

}
