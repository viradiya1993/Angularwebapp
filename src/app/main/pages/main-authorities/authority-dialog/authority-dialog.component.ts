import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { SystemSetting } from './../../../../_services';
import { GenerateTemplatesDialoagComponent } from '../../system-settings/templates/gennerate-template-dialoag/generate-template.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-authority-dialog',
  templateUrl: './authority-dialog.component.html',
  styleUrls: ['./authority-dialog.component.scss'],
  animations: fuseAnimations
})
export class AuthorityDialogComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  @Input() errorWarningData: any;
  addData:any=[];
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    
  }
  openDocument(){
    const dialogRef = this.dialog.open(GenerateTemplatesDialoagComponent, {
        disableClose: true,
        panelClass: 'contact-dialog',
        data: {
            action: 'new',
        }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    // this.SettingForm.controls['INVOICETEMPLATE'].setValue(result);  
        
    });
  }

}
