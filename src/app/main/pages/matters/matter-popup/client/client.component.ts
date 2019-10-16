import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { ContactSelectDialogComponent } from '../../../contact/contact-select-dialog/contact-select-dialog.component';
import { FormGroup } from '@angular/forms';
import { CorrespondDailogComponent } from '../../correspond-dailog/correspond-dailog.component';
import { MainAPiServiceService, BehaviorService } from 'app/_services';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  Correspond = [];
  CorrespondEdit: any;
  name: string;
  position: number;
  weight: number;
  symbol: string;
  isspiner: boolean;
  @Output() CorrespondDetail: EventEmitter<any> = new EventEmitter<any>();
  isEdit: boolean = false;
  @Input() isEditMatter: any;
  @Input() matterdetailForm: FormGroup;
  @Input() errorWarningData: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  constructor(
    private MatDialog: MatDialog,
    private _mainAPiServiceService: MainAPiServiceService,
    public behaviorService: BehaviorService,
    private dialogRef: MatDialogRef<ClientComponent>,
    private dialogRefDe: MatDialogRef<FuseConfirmDialogComponent>, private toastr: ToastrService,
  ) { }


  ngOnInit() {
    this.behaviorService.MatterEditData$.subscribe(result => {
      if (result) {
        this.isEdit = true;
        this.loadData();
      } else {
        this.isEdit = false;
      }
    });
  }
  get f() {
    return this.matterdetailForm.controls;
  }
  Addcorres_party() {
    let classTyepData = "";
    this.behaviorService.matterClassData$.subscribe(result => {
      if (result) {
        classTyepData = result.LOOKUPFULLVALUE;
      }
    });
    const dialogRef = this.MatDialog.open(CorrespondDailogComponent, { width: '100%', disableClose: true, data: { type: 'new', classTyep: classTyepData } });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.loadData();
      } else if (result) {
        this.CorrespondDetail.emit(result.saveData);
        this.Correspond.push(result.showData);
      }
    });
  }
  ContactMatter() {
    const dialogRef = this.MatDialog.open(ContactSelectDialogComponent, {
      width: '100%', disableClose: true, data: {
        type: ""
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.matterdetailForm.controls['FIRMGUID'].setValue(result.CONTACTGUID);
        this.matterdetailForm.controls['Clientmattertext'].setValue(result.CONTACTNAME + ' - ' + result.SUBURB);
      }
    });
  }
  editElement(editElement) {
    const dialogRef = this.MatDialog.open(CorrespondDailogComponent, {
      width: '100%', disableClose: true, data: { EditData: editElement, type: 'edit' }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadData();
    });
  }
  deleteElement(editElement) {
    this.confirmDialogRef = this.MatDialog.open(FuseConfirmDialogComponent, {
      disableClose: true,
      width: '100%',
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._mainAPiServiceService.getSetData({ FORMACTION: 'delete', VALIDATEONLY: false, DATA: { MATTERCONTACTGUID: editElement.MATTERCONTACTGUID } }, 'SetMatterContact').subscribe(response => {
          if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
            this.loadData();
            this.toastr.success('Matter Contact Delete successfully');
            this.isspiner = false;
          }
        }, (error: any) => {
          console.log(error);
        });
      }
      this.confirmDialogRef = null;
    });
  }
  loadData() {
    if (this.isEditMatter != undefined) {
      this._mainAPiServiceService.getSetData({ MATTERGUID: this.isEditMatter }, 'GetMatterContact').subscribe(response => {
        if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
          this.CorrespondEdit = response.DATA.MATTERCONTACTS;
        } else if (response.MESSAGE == 'Not logged in') {
          this.dialogRef.close(false);
        }
      }, error => {
        console.log(error);
      });
    }
  }


}
