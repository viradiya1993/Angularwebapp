import { Component, OnInit, Input, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorService, MainAPiServiceService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { GenerateTemplatesDialoagComponent } from 'app/main/pages/system-settings/templates/gennerate-template-dialoag/generate-template.component';

@Component({
  selector: 'app-authority-dialog',
  templateUrl: './authority-dialog.component.html',
  styleUrls: ['./authority-dialog.component.scss'],
  animations: fuseAnimations
})
export class AuthorityDialogComponent implements OnInit {
  errorWarningData: any = { "Error": [], 'Warning': [] };
  addData: any = [];
  title: any;
  MainTopicClass: any = [];
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  isspiner: boolean = false;
  isLoadingResults: boolean = false;
  AuthoDialogeData: any = [];
  public authorityDialoge = {
    AUTHORITY: '', CITATION: '', WEBADDRESS: '', REFERENCE: '', COMMENT_: '', TOPICNAME: '', AUTHORITYGUID: '', TOPICGUID: ''
  }
  action: any;
  FormAction: string;
  TopicName: any;
  AuthoId: string;
  constructor(public _matDialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
    private behaviorService: BehaviorService, private _mainAPiServiceService: MainAPiServiceService,
    private toastr: ToastrService, public dialogRef: MatDialogRef<AuthorityDialogComponent>) {
    this.action = data.action;
    if (data.action == 'edit') {
      this.title = 'Update';
    } else if (data.action == 'duplicate') {
      this.title = 'Duplicate';
    }
    else if (data.action == 'new') {
      this.title = 'Add';
    }
    this.behaviorService.MainAuthorityData$.subscribe(result => {
      if (result) {
        this.AuthoDialogeData = result;
      }
    });
    this.behaviorService.dialogClose$.subscribe(result => {
      if(result != null){
        if(result.MESSAGE == 'Not logged in'){
          this.dialogRef.close(false);
        }
      }
     });

  }
  ngOnInit() {
    this.forTopic();
    if (this.action == 'edit' || this.action == 'duplicate') {
      this.isLoadingResults = true;
      this._mainAPiServiceService.getSetData({ TOPICGUID: this.AuthoDialogeData.Main.TOPICGUID }, 'GetTopic').subscribe(responses => {
        if (responses.CODE === 200 && responses.STATUS === 'success') {
          this.authorityDialoge.TOPICNAME = responses.DATA.TOPICS[0].TOPICNAME;
          this.isLoadingResults = false;
        }
        else if (responses.MESSAGE == 'Not logged in') {
          this.dialogRef.close(false);
        }
        this.isLoadingResults = false;
      });
      this._mainAPiServiceService.getSetData({ AUTHORITYGUID: this.AuthoDialogeData.Main.AUTHORITYGUID }, 'GetAuthority').subscribe(responses => {
        if (responses.CODE === 200 && responses.STATUS === 'success') {
          this.authorityDialoge.AUTHORITY = responses.DATA.AUTHORITIES[0].AUTHORITY;
          this.authorityDialoge.CITATION = responses.DATA.AUTHORITIES[0].CITATION;
          this.authorityDialoge.COMMENT_ = responses.DATA.AUTHORITIES[0].COMMENT_;
          this.authorityDialoge.REFERENCE = responses.DATA.AUTHORITIES[0].REFERENCE;
          this.authorityDialoge.WEBADDRESS = responses.DATA.AUTHORITIES[0].WEBADDRESS;
          this.authorityDialoge.TOPICGUID = responses.DATA.AUTHORITIES[0].TOPICGUID;
          this.authorityDialoge.AUTHORITYGUID = responses.DATA.AUTHORITIES[0].AUTHORITYGUID;
          this.isLoadingResults = false;
        }
        else if (responses.MESSAGE == 'Not logged in') {
          this.dialogRef.close(false);
        }
        this.isLoadingResults = false;
      });

    }
  }
  forTopic() {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({}, 'GetTopic').subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        responses.DATA.TOPICS.forEach(element => {
          this.MainTopicClass.push(element);
          if (element.SUBTOPICS) {
            element.SUBTOPICS.forEach(element2 => {
              this.MainTopicClass.push(element2);
            });

          }
        });
        this.isLoadingResults = false;
      }
    });
  }
  openDocument() {
    const dialogRef = this._matDialog.open(GenerateTemplatesDialoagComponent, {
      disableClose: true,
      panelClass: 'contact-dialog',
      data: {
        action: 'new',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.SettingForm.controls['INVOICETEMPLATE'].setValue(result);  

    });
  }

  SaveAuthority() {
    this.isspiner = true;
    if (this.action == 'edit') {
      this.AuthoId = this.authorityDialoge.AUTHORITYGUID;
      this.FormAction = 'update';
    } else if (this.action == 'new' || this.action == 'duplicate') {
      this.AuthoId = '';
      this.FormAction = 'insert';
    }
    let data = {
      TOPICGUID: this.authorityDialoge.TOPICGUID,
      AUTHORITYGUID: this.AuthoId,
      // TOPICNAME:this.authorityDialoge.TOPICNAME,
      AUTHORITY: this.authorityDialoge.AUTHORITY,
      CITATION: this.authorityDialoge.CITATION,
      COMMENT: this.authorityDialoge.COMMENT_,
      REFERENCE: this.authorityDialoge.REFERENCE,
      WEBADDRESS: this.authorityDialoge.WEBADDRESS
    }
    let finalData = { DATA: data, FormAction: this.FormAction, VALIDATEONLY: true }
    this._mainAPiServiceService.getSetData(finalData, 'SetAuthority').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.checkValidation(response.DATA.VALIDATIONS, finalData);
      } else if (response.CODE == 451 && response.STATUS == 'warning') {
        this.checkValidation(response.DATA.VALIDATIONS, finalData);
      } else if (response.CODE == 450 && response.STATUS == 'error') {
        this.checkValidation(response.DATA.VALIDATIONS, finalData);
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      } else {
        this.isspiner = false;
      }

    }, err => {
      this.toastr.error(err);
    });

  }
  checkValidation(bodyData: any, details: any) {
    let errorData: any = [];
    let warningData: any = [];
    let tempError: any = [];
    let tempWarning: any = [];
    bodyData.forEach(function (value) {
      if (value.VALUEVALID == 'No') {
        errorData.push(value.ERRORDESCRIPTION);
        tempError[value.FIELDNAME] = value;
      }
      else if (value.VALUEVALID == 'Warning') {
        tempWarning[value.FIELDNAME] = value;
        warningData.push(value.ERRORDESCRIPTION);
      }
    });
    this.errorWarningData = { "Error": tempError, 'Warning': tempWarning };
    if (Object.keys(errorData).length != 0) {
      this.toastr.error(errorData);
      this.isspiner = false;
    } else if (Object.keys(warningData).length != 0) {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: true,
        width: '100%',
        data: warningData
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.isspiner = true;
          this.AuthoritySaveData(details);
        }
        this.confirmDialogRef = null;
      });
    } else if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0) {
      this.AuthoritySaveData(details);
      this.isspiner = false;
    }
  }

  AuthoritySaveData(data: any) {
    data.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(data, 'SetAuthority').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        if (this.action !== 'edit') {
          this.toastr.success(' save successfully');
        } else {
          this.toastr.success(' update successfully');
        }
        this.isspiner = false;
        this.dialogRef.close(true);
      } else if (response.CODE == 451 && response.STATUS == 'warning') {
        this.toastr.warning(response.MESSAGE);
      } else if (response.CODE == 450 && response.STATUS == 'error') {
        this.toastr.error(response.MESSAGE);
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, error => {
      this.toastr.error(error);
    });
  }
  TopicClassChange(val) {
    let value = this.MainTopicClass.find(c => c['TOPICNAME'] == val);
    this.authorityDialoge.TOPICGUID = value.TOPICGUID;
  }

}
