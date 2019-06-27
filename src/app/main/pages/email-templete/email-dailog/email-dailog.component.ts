import { Component, OnInit, Inject ,ViewChild} from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatDialogConfig } from '@angular/material';
import { MatSort } from '@angular/material'

export interface PeriodicElement {
  Name: string;
  Description: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { Name: 'Amit', Description: 'Hydrogen'},
  { Name: 'Karan', Description: 'Helium'},
  { Name: 'Jay', Description: 'Lithium'},
  { Name: 'Kalpesh', Description: 'Beryllium'},

];

@Component({
  selector: 'app-email-dailog',
  templateUrl: './email-dailog.component.html',
  styleUrls: ['./email-dailog.component.scss']
})
export class EmailDailogComponent implements OnInit {
  EmailTemplete:FormGroup;
  isLoadingResults: boolean = false;
  action: string;
  dialogTitle: string;
  isspiner: boolean = false;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  Name = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  displayedColumns: string[] = ['Name', 'Description'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  To_options: string[] = ['<i:mc-email>', '<i:f-email>', '<i:mcs-email>','<i:s-email>'];
  CC_options: string[] = ['<i:mc-email>', '<i:f-email>', '<i:mcs-email>','<i:s-email>'];
  BCC_options: string[] = ['<i:mc-email>', '<i:f-email>', '<i:mcs-email>','<i:s-email>'];
  SUb_options: string[] = ['<i:mc-email>', '<i:f-email>', '<i:mcs-email>','<i:s-email>'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<EmailDailogComponent>,
    private router: Router,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) 
  { 
    this.action = data.action;
    if(this.action === 'new'){
      this.dialogTitle = 'New Email';
    }else if(this.action === 'edit'){
      this.dialogTitle = 'Edit Email';
    }else{
      this.dialogTitle = 'Copy Document';
    }
  }


  ngOnInit() {
    this.EmailTemplete = this._formBuilder.group({
      name:[],
      ToEmail:[],
      CCEmail:[],
      BCCEmail:[],
      subject:[],
      attachment:[],
      text:[]
    });
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
  }
  //Email Save
  EmailSave(){
    console.log('Email Save Work!!');
  }
  //Dcoument Floder
  DcoumentFloder(){
    console.log('DcoumentFloder work!!!');
  }
  //CloseEmail
  CloseEmail(){
    this.dialogRef.close(false);
  }
  //clicktable
  clicktable(val){
   console.log(val);
  }

}
