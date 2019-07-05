import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator,MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import {MatSort} from '@angular/material';
import {MatTableDataSource} from '@angular/material/table';
import * as $ from 'jquery';
import { MatterPopupComponent } from 'app/main/pages/matters/matter-popup/matter-popup.component';
import { ContactDialogComponent } from './../../../main/pages/contact/contact-dialog/contact-dialog.component';



export interface PeriodicElement {
  Date: number;
  DocNo: number;
  Description:string;
  DocumentName: string;
  Keywords: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {Date: 1, DocNo: 1,Description:'Fill Doc', DocumentName: 'Amit', Keywords: 'H'},
  {Date: 2, DocNo: 2,Description:'Unfill Doc', DocumentName: 'Rajiv', Keywords: 'He'},
  {Date: 3, DocNo: 3,Description:'Other Doc', DocumentName: 'Ankur', Keywords: 'Li'},
  {Date: 4, DocNo: 4,Description:'No Doc', DocumentName: 'Kalpesh', Keywords: 'Be'},
  {Date: 5, DocNo: 5,Description:'Yes Doec', DocumentName: 'Gunjan', Keywords: 'B'},
  
];

@Component({
  selector: 'app-document-register',
  templateUrl: './document-register.component.html',
  styleUrls: ['./document-register.component.scss']
})
export class DocumentRegisterComponent implements OnInit {
  documentform: FormGroup;
  isLoadingResults: boolean = false;
  highlightedRows:any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  DocNo = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  displayedColumns: string[] = ['Date', 'DocNo','Description', 'DocumentName','Keywords'];
  DocumentAllData = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private toastr: ToastrService,
  ) 
  {}

  ngOnInit() {
    this.DocumentAllData.sort = this.sort;
    this.DocumentAllData.paginator = this.paginator;
    this.documentform = this._formBuilder.group({
      matter:[],
      Client:[],
      search:[],
      foldervalue:[],
      showfolder:[]
    });
    let mattersData = JSON.parse(localStorage.getItem('set_active_matters'));
    this.documentform.controls['matter'].setValue(mattersData.MATTER); 
  }
 
  //DcoumentFloder
  DcoumentFloder(){
    const dialogConfig = new MatDialogConfig();
        let mattersData = JSON.parse(localStorage.getItem('set_active_matters'));
        const dialogRef = this.dialog.open(MatterPopupComponent, {
            width: '100%',
            disableClose: true,
            data: { action: 'edit', 'matterGuid': mattersData.MATTERGUID }
        });
        dialogRef.afterClosed().subscribe(result => { });
  }
  //Client
  SelectClient(){
    if (!localStorage.getItem('contactGuid')) {
      this.toastr.error("Please Select Contact");
    } else {
      const dialogRef = this.dialog.open(ContactDialogComponent, { disableClose: true, data: { action: 'edit' } });
      dialogRef.afterClosed().subscribe(result => {
          if (result)
          $('#refreshContactTab').click();
      });
    }
  }
  //FilterSearch
  FilterSearch(filterValue:any){
    this.DocumentAllData.filter = filterValue;
  }
  //DocumentDialog

  DocumentDialog(){
    console.log('DocumentDialog Work!!');
  }
  //FloderChnage
  FloderChnage(value){
    console.log(value);
  }
  //Click Doc
  clickDoc(){

  }
}
