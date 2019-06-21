
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource,MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import {MatSort} from '@angular/material';
import * as $ from 'jquery';



export interface ActivityElement {
  Username: string;
  Userid: number;
  Active: string;
  Fullname: string;
  Comment: string;
  Position: string;
  Phone: number;
  Mobile: number;
  Email: string;

}
const ELEMENT_DATA: ActivityElement[] = [
  { Username: 'Amit', Userid: 1, Active:'Yes',Fullname:'Amit Viradiya',Comment: '---',Position: 'Partner',Phone:265282,Mobile:9727809070,Email:'web6@moontechnolabs.com'},
  { Username: 'Karan', Userid: 2, Active:'Yes',Fullname:'Amit Viradiya',Comment: '---',Position: 'Partner',Phone:265282,Mobile:9727809070,Email:'web6@moontechnolabs.com'},
  { Username: 'Kalpesh', Userid: 3, Active:'Yes',Fullname:'Amit Viradiya',Comment: '---',Position: 'Partner',Phone:265282,Mobile:9727809070,Email:'web6@moontechnolabs.com'},
  { Username: 'Ankur', Userid: 4, Active:'Yes',Fullname:'Amit Viradiya',Comment: '---',Position: 'Partner',Phone:265282,Mobile:9727809070,Email:'web6@moontechnolabs.com'},
];

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: fuseAnimations
})
export class UsersComponent implements OnInit {
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  Userid = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  userfilter: FormGroup;
  isLoadingResults: boolean = false;
  displayedColumns: string[] = ['Username', 'Userid', 'Active','Fullname','Comment','Position','Phone','Mobile','Email'];
  Useralldata = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  

  constructor(
    private _formBuilder: FormBuilder,
    private dialog: MatDialog
    ) {}
  Userdata;
  ngOnInit() {
    this.Useralldata.sort = this.sort;
    this.Useralldata.paginator = this.paginator;
    this.userfilter = this._formBuilder.group({
      UserType: ['']
    });
  }
  UserTypeChange(value){
    
  }
  
  //userDialog
  userDialog(){
  }
  //Click User Row
  clickuser(val){
   
  }
}
