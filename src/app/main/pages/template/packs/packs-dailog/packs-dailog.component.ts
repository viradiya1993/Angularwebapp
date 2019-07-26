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
import { NewPacksDailogComponent } from '../../packs/new-packs-dailog/new-packs-dailog.component';
import { fuseAnimations } from '@fuse/animations';


@Component({
  selector: 'app-packs-dailog',
  templateUrl: './packs-dailog.component.html',
  styleUrls: ['./packs-dailog.component.scss'],
  animations: fuseAnimations,
})
export class PacksDailogComponent implements OnInit {
  PackDocument:FormGroup;
  isLoadingResults: boolean = false;
  action: string;
  getDataForTable:any=[];
  dialogTitle: string;
  isspiner: boolean = false;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  Order = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  displayedColumns: string[] = ['Order', 'TempleteFile','Prom','Copies'];
  DocumentPack:any=[];
  // DocumentPack = new MatTableDataSource(ELEMENT_DATA);
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public MatDialog: MatDialog,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PacksDailogComponent>,
    private router: Router,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) 
  { 
    this.action = data.action;
    this.dialogTitle = this.action === 'edit' ? 'Edit Pack' : 'New Pack';
  }

  ngOnInit() {
    
    this.DocumentPack.paginator = this.paginator;
    this.DocumentPack.sort = this.sort;
    this.PackDocument = this._formBuilder.group({
      packName:['',Validators.required],
      Context:['']
    });
  }

  //ContextChnage Dropwown
  ContextChnage(value){
    console.log(value);
  }

  //Pack Save
  PackSave(){
    console.log('pack save work!!');
  }
  //Click Pack Tbl
  ClickPackTbl(value){
    console.log(value);
  }

  //Add Pack Item]
  AddPack(){
    // this.getDataForTable=[];
    console.log('Add pack');
    const dialogRef = this.dialog.open(NewPacksDailogComponent, {
      disableClose: true,
      panelClass: 'AddPack-dialog',
      data: {
          action: 'new',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getDataForTable.push(result);
      // this.DocumentPack = new MatTableDataSource(result);
        console.log(result);
    });
  }

  //Edit Pack Item
  EditPack(){
    console.log('Edit pack');
    const dialogRef = this.dialog.open(NewPacksDailogComponent, {
      disableClose: true,
      panelClass: 'EditPack-dialog',
      data: {
          action: 'edit',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
        console.log(result);
    });
  }
   //Delete Pack Item
  DeletePack(){
    console.log('Delete pack');
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: true,
      width: '100%',
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
  //Close Pack
  ClosePack(){
    this.dialogRef.close(false);
  }
  rowdata(row){

  }

}
