import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator,MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import {MatSort} from '@angular/material';
import {MatTableDataSource} from '@angular/material/table';
import * as $ from 'jquery';
import {ReceiptDilogComponent} from './../invoice/receipt-dilog/receipt-dilog.component';

export interface PeriodicElement {
  Date: number;
  Description:string;
  Account: number;
  DebitAmount: string;
  CreditAmount: string;
  ReconciledBankSlip:string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {Date: 1, Description:'Payment',Account:1, DebitAmount: 'Amit', CreditAmount: 'H',ReconciledBankSlip:'abc'},
  {Date: 2, Description:'Unfill Doc',Account:2, DebitAmount: 'Rajiv', CreditAmount: 'He',ReconciledBankSlip:'abc'},
  {Date: 3, Description:'Other Doc',Account:3, DebitAmount: 'Ankur', CreditAmount: 'Li',ReconciledBankSlip:'abc'},
  {Date: 4, Description:'No Doc', Account:4,DebitAmount: 'Kalpesh', CreditAmount: 'Be',ReconciledBankSlip:'abc'},
  {Date: 5, Description:'Yes Doec',Account:5, DebitAmount: 'Gunjan', CreditAmount: 'B',ReconciledBankSlip:'abc'},
];

@Component({
  selector: 'app-general-journal',
  templateUrl: './general-journal.component.html',
  styleUrls: ['./general-journal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class GeneralJournalComponent implements OnInit {
  GeneralForm: FormGroup;
  isLoadingResults: boolean = false;
  highlightedRows:any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  Date = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  displayedColumns: string[] = ['Date', 'Description','Account', 'DebitAmount','CreditAmount','ReconciledBankSlip'];
  GeneralAllData = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor( 
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private toastr: ToastrService,
    public _matDialog: MatDialog
  ) { }

  ngOnInit() {
    this.GeneralAllData.sort = this.sort;
    this.GeneralAllData.paginator = this.paginator;
    this.GeneralForm = this._formBuilder.group({
      date:[new Date()],
      searchFilter:[''],
      Receipts:[],
      Invoice:[],
      ReceiveMoney:[],
      SpendMoney:[],
      GeneralJournal:[]
    });
  }
  //choosedDate
  choosedDate(){

  }
  //GeneralDialog
  GeneralDialog(){}

  //onSearch
  onSearch(searchFilter:any){
    console.log(searchFilter);
  }
  openDialog(val){
    if(val.Description == 'Payment'){
      const dialogRef = this._matDialog.open(ReceiptDilogComponent, {
        width: '100%', disableClose: true,
        data:{}
      });
      dialogRef.afterClosed().subscribe(result => {
      });

    }else {
    
    }
  }

//ClickGeneral
  ClickGeneral(val){
    console.log(val.Description);
  }
}
