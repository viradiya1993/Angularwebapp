import { Component, OnInit, ViewChild } from '@angular/core';
import { MattersService,  } from './../../../../_services';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-contact-select-dialog',
  templateUrl: './contact-select-dialog.component.html',
  styleUrls: ['./contact-select-dialog.component.scss'],
  animations: fuseAnimations
})
export class ContactSelectDialogComponent implements OnInit {
  displayedColumns: string[] = ['matternumber', 'matter', 'client'];
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  highlightedRows: any;
  currentMatterData: any;
  getDataForTable: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLoadingResults: boolean;
  SelectcontactForm: FormGroup;
  pageSize: any;
  
  constructor(
    private mattersService: MattersService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    ) { 
      this.SelectcontactForm = this.fb.group({ Show: [''], Clientmatter: [''], ActiveContacts: [''], Filter: [''], });
  }
  
 
  ngOnInit() {
    let d = {};
    this.isLoadingResults = true;
    this.mattersService.getMatters(d).subscribe(response => {
      //console.log(response);
      if (response.CODE == 200 && response.STATUS === "success") {
        if (response.DATA.MATTERS[0]) {
          this.highlightedRows = response.DATA.MATTERS[0].MATTERGUID;
          this.currentMatterData = response.DATA.MATTERS[0];
        }
        this.getDataForTable = new MatTableDataSource(response.DATA.MATTERS);
        this.getDataForTable.paginator = this.paginator;
        this.isLoadingResults = false;
      }
    }, error => {
      this.toastr.error(error);
    });
  }
  get f() {
    return this.SelectcontactForm.controls;
  }
  selectMatterId(Row: any) {
    this.currentMatterData = Row;    
  }

  // onPaginateChange(event) {
  //   this.pageSize = event.pageSize;
  //   localStorage.setItem('lastPageSize', event.pageSize);
  // }
}
