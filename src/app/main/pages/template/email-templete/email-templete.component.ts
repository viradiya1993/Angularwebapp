import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, } from '@angular/material';
import { MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import * as $ from 'jquery';
import { fuseAnimations } from '@fuse/animations';

export interface PeriodicElement {
  Title: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { Title: 'abc' },
  { Title: 'Def' },
  { Title: 'mmm' },
  { Title: '000' },
];
@Component({
  selector: 'app-email-templete',
  templateUrl: './email-templete.component.html',
  styleUrls: ['./email-templete.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations

})
export class EmailTempleteComponent implements OnInit {
  EmailAllData: FormGroup;
  isLoadingResults: boolean = false;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  Title = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  displayedColumns: string[] = ['Title'];
  EmailDataTbl = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.EmailDataTbl.sort = this.sort;
    this.EmailDataTbl.paginator = this.paginator;
    this.EmailAllData = this._formBuilder.group({
      Filter: [],
      search: []
    });
  }
  // FilterSearch
  FilterSearch(filterValue: any) {
    this.EmailDataTbl.filter = filterValue;
  }
  //clicktitle
  clicktitle(value) {
    console.log(value);
  }
  //EmailDialog
  EmailDialog() {

  }

}

