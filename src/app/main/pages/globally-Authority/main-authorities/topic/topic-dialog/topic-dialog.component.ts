import { Component, OnInit, Input, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MainAPiServiceService, BehaviorService } from 'app/_services';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-topic-dialog',
  templateUrl: './topic-dialog.component.html',
  styleUrls: ['./topic-dialog.component.scss'],
  animations: fuseAnimations
})
export class TopicDialogComponent implements OnInit {
  errorWarningData: any = { "Error": [], 'Warning': [] };
  isLoadingResults: boolean = false;
  isspiner: boolean = false;
  addData: any = [];
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  MainTopicClass: any = [];
  public TopicDialoge = {
    TOPICNAME: '', Parent: '', TOPICGUID: '', PARENTGUID: '', selective: ''
  }
  ShowParent: string;
  action: string;
  FormAction: string;
  TopicGuid: string;
  title: string;
  TopicClassVal: any;
  parentGuid: string;
  MainTopicData: any;
  constructor(private _mainAPiServiceService: MainAPiServiceService, public _matDialog: MatDialog, public behaviorService: BehaviorService,
    private toastr: ToastrService, public dialogRef: MatDialogRef<TopicDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, ) {
    this.action = data.action;
    if (data.action == 'edit') {
      this.title = 'Update';
    } else if (data.action == 'duplicate') {
      this.title = 'Duplicate';
    }
    else if (data.action == 'new') {
      this.title = 'Add';
    }
    this.behaviorService.MainTopicData$.subscribe(result => {
      if (result) {

        this.MainTopicData = result;
      }
    });
  }
  ngOnInit() {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({}, 'GetTopic').subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        responses.DATA.TOPICS.forEach(element => {
          this.MainTopicClass.push(element);
          this.isLoadingResults = false;
          if (element.SUBTOPICS) {
            element.SUBTOPICS.forEach(element2 => {
              this.MainTopicClass.push(element2);
            });

          }
        });
      }
    });
    if (this.action == 'edit' || this.action == 'duplicate') {
      this._mainAPiServiceService.getSetData({ TOPICGUID: this.MainTopicData.Main.TOPICGUID }, 'GetTopic').subscribe(responses => {
        if (responses.CODE === 200 && responses.STATUS === 'success') {
          this.TopicDialoge.selective = '1';
          this.TopicClassChange('1');
          this.TopicDialoge.TOPICNAME = responses.DATA.TOPICS[0].TOPICNAME;
          this.TopicDialoge.TOPICGUID = responses.DATA.TOPICS[0].TOPICGUID;
          if (responses.DATA.TOPICS[0].PARENTGUID != "") {
            this._mainAPiServiceService.getSetData({ TOPICGUID: responses.DATA.TOPICS[0].PARENTGUID }, 'GetTopic').subscribe(responses => {
              if (responses.CODE === 200 && responses.STATUS === 'success') {
                this.TopicDialoge.Parent = responses.DATA.TOPICS[0].TOPICNAME;
                this.TopicDialoge.PARENTGUID = responses.DATA.TOPICS[0].TOPICGUID;
                this.TopicDialoge.selective = '2';
                this.TopicClassChange('2');

              }
            });
          } else {
            this.TopicDialoge.selective = '1';
            this.TopicClassChange('1');
            this.TopicDialoge.TOPICNAME = responses.DATA.TOPICS[0].TOPICNAME;
            this.TopicDialoge.TOPICGUID = responses.DATA.TOPICS[0].TOPICGUID;
          }

          this.isLoadingResults = false;
        }
        else if (responses.MESSAGE == 'Not logged in') {
          this.dialogRef.close(false);
        }
        this.isLoadingResults = false;
      });


    } else {
      this.TopicDialoge.selective = '1';
      this.TopicClassChange('1');
    }

  }
  TopicClassChange(val) {
    this.TopicClassVal = val;
    if (val == '2') {
      this.ShowParent = 'yes';
    } else {
      this.ShowParent = 'no';
    }
  }
  TopicNameChange(val) {
    let value = this.MainTopicClass.find(c => c['TOPICNAME'] == val);

    this.TopicDialoge.PARENTGUID = value.TOPICGUID;
  }
  saveTopic() {
    this.isspiner = true;
    if (this.action == 'edit') {
      this.FormAction = 'update';
      this.TopicGuid = this.TopicDialoge.TOPICGUID
    } else if (this.action == 'new' || this.action == 'duplicate') {
      this.FormAction = 'insert';
      this.TopicGuid = ""
    }
    if (this.TopicClassVal == '2') {
      this.parentGuid = this.TopicDialoge.PARENTGUID;
    } else {
      this.parentGuid = '';
    }
    let data = {
      TOPICGUID: this.TopicGuid,
      PARENTGUID: this.parentGuid,
      TOPICNAME: this.TopicDialoge.TOPICNAME

    }
    let finalData = { DATA: data, FormAction: this.FormAction, VALIDATEONLY: true }
    this._mainAPiServiceService.getSetData(finalData, 'SetTopic').subscribe(response => {
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
      this.isspiner = false;
      this.toastr.error(errorData);
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
    this._mainAPiServiceService.getSetData(data, 'SetTopic').subscribe(response => {
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

}
