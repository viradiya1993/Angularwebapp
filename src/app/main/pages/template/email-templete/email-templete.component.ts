import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, } from '@angular/material';
import { MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import * as $ from 'jquery';
import { fuseAnimations } from '@fuse/animations';
import { TemplateListDetails ,TableColumnsService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-email-templete',
  templateUrl: './email-templete.component.html',
  styleUrls: ['./email-templete.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations

})
export class EmailTempleteComponent implements OnInit {
  EmailAllData: FormGroup;
  tempColobj: any;
  ColumnsObj: any;
  TemplateEmaildata:any=[];
  isLoadingResults: boolean = false;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  Title = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  displayedColumns: any = ['TYPEICON', 'NAME'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  highlightedRows: any;
  pageSize: any;
  constructor(
    private _formBuilder: FormBuilder,
    public TemplateListData: TemplateListDetails,
    private toastr: ToastrService,
    private TableColumnsService: TableColumnsService,
  ) { }

  ngOnInit() {
    this.EmailAllData = this._formBuilder.group({
      Filter: [''],
      search: ['']
    });

    this.LoadData({});
    
  }
  // getTableFilter() {
  //   this.TableColumnsService.getTableFilter('generate email', '').subscribe(response => {
  //     console.log(response);
  //     if (response.CODE == 200 && response.STATUS == "success") {
  //       let data = this.TableColumnsService.filtertableColum(response.DATA.COLUMNS);
  //       this.tempColobj = data.tempColobj;
  //       this.displayedColumns = data.showcol;
  //       this.ColumnsObj = data.colobj;
  //     }
  //   }, error => {
  //     this.toastr.error(error);
  //   });
  // }
  LoadData(passdata){
    this.isLoadingResults = true;
    this.TemplateListData.getEmailList(passdata).subscribe(response => {
        console.log(response);
      if (response.CODE == 200 && response.STATUS == "success") {
        this.TemplateEmaildata = new MatTableDataSource(response.DATA.EMAILS);
        // this.editContact(response.DATA.TEMPLATES[0]);
        this.TemplateEmaildata.paginator = this.paginator;
        this.TemplateEmaildata.sort = this.sort;
        if (response.DATA.EMAILS[0]) {
         
          localStorage.setItem('GenerateEmailData', JSON.stringify(response.DATA.EMAILS[0]));
          this.highlightedRows = response.DATA.EMAILS[0].EMAILGUID;
        }
        this.isLoadingResults = false;
      }
    }, err => {

      this.toastr.error(err);
      this.isLoadingResults = false;
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  // FilterSearch
  FilterSearch(filterValue: any) {
    // this.EmailDataTbl.filter = filterValue;
  }
  //clicktitle
  clicktitle(value) {
    console.log(value);
  }
  //EmailDialog
  EmailDialog() {

  }

}

