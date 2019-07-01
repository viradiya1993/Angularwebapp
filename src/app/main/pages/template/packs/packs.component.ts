import { Component, OnInit, Inject ,ViewChild} from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatDialogConfig } from '@angular/material';
import { MatSort } from '@angular/material'
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component'


export interface PeriodicElement {
  Order: number;
  TempleteFile: any;
  PromCopies:number;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { Order: 1, TempleteFile: 'Hydrogen',PromCopies:1},
  { Order: 2, TempleteFile: 'Helium',PromCopies:2},
  { Order: 3, TempleteFile: 'Lithium',PromCopies:3},
  { Order: 4, TempleteFile: 'Beryllium',PromCopies:4},

]
@Component({
  selector: 'app-packs',
  templateUrl: './packs.component.html',
  styleUrls: ['./packs.component.scss']
})

export class PacksComponent implements OnInit {
  PackDocument:FormGroup;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  Order = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  displayedColumns: string[] = ['Order', 'TempleteFile','PromCopies'];
  Packdata = new MatTableDataSource(ELEMENT_DATA);
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public MatDialog: MatDialog,
    public dialog: MatDialog,
    private router: Router,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    public _matDialog: MatDialog,
  ) { }

  ngOnInit() {
    this.Packdata.paginator = this.paginator;
    this.Packdata.sort = this.sort;
    this.PackDocument = this._formBuilder.group({
      Filter:[],
      search:[]
    });
  }
  openDialog(){
    
  }
  FilterSearch(filtervalue:any){
    this.Packdata.filter = filtervalue;
  }
  ClickPackTbl(value){
    console.log(value);
  }
}
