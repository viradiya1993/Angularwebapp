import { Component, OnInit, Input, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { GenerateTemplatesDialoagComponent } from '../../system-settings/templates/gennerate-template-dialoag/generate-template.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

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
  title: any;
  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {
    if(data.action == 'edit'){
    this.title='Update';
    }else if(data.action == 'copy'){
      this.title='Duplicate';
    }
    else{
      this.title='Add';
    }
   }

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
