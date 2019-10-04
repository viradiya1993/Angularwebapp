import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import {  MainAPiServiceService, BehaviorService } from './../../../../_services';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MatDialog } from '@angular/material';
import { MatterDialogComponentForTemplate } from '../../template/matter-dialog/matter-dialog.component';

@Component({
  selector: 'app-generate-invoice',
  templateUrl: './generate-invoice.component.html',
  styleUrls: ['./generate-invoice.component.scss'],
  animations: fuseAnimations
})
export class GenerateInvoiceComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  isLoadingResults: boolean = false;
  @Input() errorWarningData: any;
  addData:any=[];
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  displayedColumns: string[] = ['Pack'];
    GenerateInvoiceData: any;
    highlightedRows: any;
    slectedPack: any;
    Invoicedata: any;
  passdata: { Template: any; Context: string; ContextGuid: any; Type: string; };
  constructor(private _mainAPiServiceService:MainAPiServiceService,
    private toastr: ToastrService,public dialogRef: MatDialogRef<GenerateInvoiceComponent>,
    private behaviorService: BehaviorService,
    private dialog: MatDialog,
   ) 
    {
        this.behaviorService.matterInvoice$.subscribe(result => {
            if (result) {
                this.Invoicedata=result;
          
            }
          });
     }

  ngOnInit() {
  this.loadData();
  }
  
  loadData(){
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({Context: "Invoice"}, 'GetKit').subscribe(res => {
        console.log(res);
        if (res.CODE == 200 && res.STATUS == "success") {
            this.GenerateInvoiceData=res.DATA.KITS;
            if(res.DATA.KITS[0]){
                this.highlightedRows = res.DATA.KITS[0].KITGUID;
                this.RowClick(res.DATA.KITS[0]);
            }else{
                //
            }
        } else if (res.MESSAGE == 'Not logged in') {
          this.dialogRef.close(false);
        }
        this.isLoadingResults = false;
      }, err => {
        this.toastr.error(err);
        this.isLoadingResults = false;
      });
  }
  RowClick(val){
    this.slectedPack=val;
  }
  
  GenerateDocumentPack(val){
    if(val=="Pack"){
  this.passdata={
        Template:this.slectedPack.KITNAME,
        Context:'Invoice',
        ContextGuid:this.Invoicedata.INVOICEGUID,
        Type:'Pack'
    }    
    }else{
      this.passdata={
        Template: '<'+this.slectedPack.KITNAME+'>',
        Context:'Invoice',
        ContextGuid:this.Invoicedata.INVOICEGUID,
        Type:'Template'
    }
    }
    // let passdata = { 'Context': "Contact", 'ContextGuid': ContactGuID, "Type": "Pack", "Folder": '', "Template": this.KitName }
    const dialogRef = this.dialog.open(MatterDialogComponentForTemplate, {
      width: '100%',
      disableClose: true,
      data: this.passdata
  });
  dialogRef.afterClosed().subscribe(result => {

  });
    // this.isLoadingResults = true;
    // let data={
    //     Template:this.slectedPack.KITNAME,
    //     Context:'Invoice',
    //     ContextGuid:this.Invoicedata.INVOICEGUID,
    //     Type:'Pack'
    // }
    // this._mainAPiServiceService.getSetData(data, 'TemplateGenerate').subscribe(response => {
    //   console.log(response);  
    //   if (response.CODE == 200 && response.STATUS == "success") {
      
    // }

    // }, error => {
    //   this.toastr.error(error);
    //   this.dialogRef.close();

    // });
  }
  GenerateInvoiveOnly(){

  }

}
