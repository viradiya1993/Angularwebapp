import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { TemplateListDetails } from 'app/_services';
import { MatTableDataSource, MatPaginator, MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
// import { SystemSetting } from './../../../../_services';

@Component({
  selector: 'app-generate-template',
  templateUrl: './generate-template.component.html',
  styleUrls: ['./generate-template.component.scss'],
  animations: fuseAnimations
})
export class GenerateTemplatesDialoagComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  displayedColumns: any = ['TEMPLATETYPE', 'TEMPLATENAME'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  isLoadingResults: boolean;
  Templatedata: any = [];
  getTemplateArray: any = [];
  highlightedRows: any;
  getDropDownValue: any = [];

  pageSize: any;
  constructor(public TemplateListData: TemplateListDetails, private toastr: ToastrService,
    public dialogRef: MatDialogRef<GenerateTemplatesDialoagComponent>, ) { }

  ngOnInit() {
    this.isLoadingResults = true;
    let d = {};
    this.TemplateListData.getTemplateList(d).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.Templatedata = new MatTableDataSource(response.DATA.TEMPLATES);

        this.Templatedata.paginator = this.paginator;
        if (response.DATA.TEMPLATES[0]) {
          // localStorage.setItem('contactGuid', response.DATA.CONTACTS[0].CONTACTGUID);
          this.highlightedRows = response.DATA.TEMPLATES[0].TEMPLATENAME;
        }
        this.isLoadingResults = false;
      }
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }

  selectTemplate(data) {
    this.dialogRef.close(data.TEMPLATENAME);
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }

}
