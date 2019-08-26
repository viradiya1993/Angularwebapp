import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MainAPiServiceService } from 'app/_services';
import { MatterPopupComponent } from '../matters/matter-popup/matter-popup.component';
import { MatDialog } from '@angular/material';
import { MatterDialogComponent } from '../time-entries/matter-dialog/matter-dialog.component';
import { ContactSelectDialogComponent } from '../contact/contact-select-dialog/contact-select-dialog.component';
import * as $ from 'jquery';

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss'],
    animations: fuseAnimations
})
export class TaskComponent implements OnInit {
    @Input() SettingForm: FormGroup;
    @Input() errorWarningData: any;
    MainTask: FormGroup;
    addData: any = [];
    constructor(private _mainAPiServiceService: MainAPiServiceService, private dialog: MatDialog,
        private _formBuilder: FormBuilder) { }

    ngOnInit() {
        $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + $('.sticky_search_div').height() + 70)) + 'px');
        this.MainTask = this._formBuilder.group({
            matterCheck: [''],
            active: [''],
            status: [''],
            matter: [''],
            User: [''],
            search: ['']

        });
        this.MainTask.controls['matterCheck'].setValue(true);
        this.MainTask.controls['status'].setValue('all');
        this.MainTask.controls['matter'].disable();
        // this._mainAPiServiceService.getSetData({}, 'GetSystem').subscribe(response=>{
        //  // console.log(response);
        //   this.addData=response.DATA.SYSTEM.ADDRESSGROUP.POSTALADDRESSGROUP
        // })
    }
    get f() {
        //console.log(this.contactForm);
        return this.MainTask.controls;
    }
    CheckboxChecxed() {
        if (this.f.matterCheck.value == true) {
            this.MainTask.controls['matter'].disable();
        } else {
            this.MainTask.controls['matter'].enable();
            const dialogRef = this.dialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: null });
            dialogRef.afterClosed().subscribe(result => {

                if (result) {
                    localStorage.setItem('set_active_matters', JSON.stringify(result));
                    this.MainTask.controls['matter'].setValue(result.MATTER);
                }
                else if (this.f.matter.value == '') {
                    this.MainTask.controls['matterCheck'].setValue(true);
                }
            });
        }
    }
    SelectMatter() {
        const dialogRef = this.dialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: null });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
            }
        });
    }

    DateRange() {

    }
    DateRange1() {

    }
}
