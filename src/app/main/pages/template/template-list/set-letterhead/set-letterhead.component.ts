import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService } from 'app/_services';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { GenerateTemplatesDialoagComponent } from 'app/main/pages/system-settings/templates/gennerate-template-dialoag/generate-template.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-set-letterhead',
  templateUrl: './set-letterhead.component.html',
  styleUrls: ['./set-letterhead.component.scss'],
  animations: fuseAnimations
})
export class SetLetterHeadComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  ALLTemplateData: any = [];
  highlightedRows: any;
  highlightedRows1: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  Name = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  @Input() errorWarningData: any;
  addData: any = [];
  TemplateToChange: any = [];
  SetLetterData = {
    'ExampleDoc': "example.com", "ApplyHeaders": true, "ApplyFooters": true
  }
  ShowSection: string;
  isLoadingResults: boolean;
  INDEXOFTEMPCHANG: any;
  INDEXOFTEMPALL: any;
  constructor(private _mainAPiServiceService: MainAPiServiceService, private toastr: ToastrService,
    public dialogRef: MatDialogRef<SetLetterHeadComponent>, public dialog: MatDialog) { }

  ngOnInit() {
    this.ShowSection = "Previous";
    this.LoadData({});
    // this.LoadData2({});
    // this._mainAPiServiceService.getSetData({}, 'GetSystem').subscribe(response=>{
    //  // console.log(response);
    //   this.addData=response.DATA.SYSTEM.ADDRESSGROUP.POSTALADDRESSGROUP
    // })

  }
  LoadData(data) {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData(data, 'TemplateList').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        response.DATA.TEMPLATES.forEach(element => {
          this.ALLTemplateData.push(element);
          this.TemplateToChange.push(element);

        });
        // response.DATA.TEMPLATES.forEach(element => {
        //  if(element.TEMPLATENAME !="Authority.dotx"){
        //    element.splice(0,1);
        //   this.TemplateToChange.push(element);
        //  }
         

        // });
        // response.DATA.TEMPLATES.forEach(function (item, index) {
        //   if (index != 0)
        //     this.TemplateToChange.push(item);
        // });
        if (response.DATA.TEMPLATES[0]) {
          // localStorage.setItem('contactGuid', response.DATA.CONTACTS[0].CONTACTGUID);
          this.highlightedRows = 0;
          this.highlightedRows1 = 0
        }
        this.isLoadingResults = false;
      }
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
    });
    // this.pageSize = localStorage.getItem('lastPageSize');
  }
  // LoadData2(data) {
  //   this.isLoadingResults = true;
  //   this._mainAPiServiceService.getSetData(data, 'TemplateList').subscribe(response => {
  //     if (response.CODE == 200 && response.STATUS == "success") {

  //       response.DATA.TEMPLATES.forEach(function (item, index) {
  //         if (index != 0)
  //           this.TemplateToChange.push(item);
  //       });

  //       if (response.DATA.TEMPLATES[0]) {
  //         this.highlightedRows1 = 0
  //       }
  //       this.isLoadingResults = false;
  //     }
  //   }, err => {
  //     this.isLoadingResults = false;
  //     this.toastr.error(err);
  //   });

  // }

  NextSetLetter() {
    this.ShowSection = "Next";
  }
  PreviousSetLetter() {
    this.ShowSection = "Previous";
  }
  closepopup() {
    this.dialogRef.close(false);
  }

  SelectDocument() {
    const dialogRef = this.dialog.open(GenerateTemplatesDialoagComponent, {
      disableClose: true,
      panelClass: 'contact-dialog',
      data: {
        action: '',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    //this.SettingForm.controls['INVOICETEMPLATE'].setValue(result);  
    });
  }
  TempChange(item, index) {
    this.INDEXOFTEMPCHANG = index;
    // this.TemplateToChange.splice(index,1);
  }
  AllTempRow(val, index) {
    this.INDEXOFTEMPALL = index;
  }
  deleteElement() {
    this.TemplateToChange.splice(this.INDEXOFTEMPCHANG, 1);
  }
  AddAllRow() {
    this.TemplateToChange = [];
    // this.LoadData2({})
  }
}
