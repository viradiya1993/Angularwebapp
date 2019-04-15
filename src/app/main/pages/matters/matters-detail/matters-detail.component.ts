import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';

import { MattersService } from '../../../../_services';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-matters-detail',
  templateUrl: './matters-detail.component.html',
  styleUrls: ['./matters-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MattersDetailComponent implements OnInit {
  displayedColumns: string[] = ['Name', 'Type', 'Mobile', 'Phone_no', 'Email'];
  MatterContact: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  currentMatterId: any;
  currentMatter: any;
  constructor(
    private route: ActivatedRoute,
    private _mattersService: MattersService,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.route.url.subscribe(v =>
      this.currentMatterId = v[0].path
    );
    // currentMatterId
    let postData = { 'MatterGuid': this.currentMatterId };
    this._mattersService.getMattersDetail(postData).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.currentMatter = response.DATA.MATTERS[0];
      }
    }, error => {
      this.toastr.error(error);
    });
    this._mattersService.getMattersContact(postData).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.MatterContact = new MatTableDataSource(response.DATA.queue);
        this.MatterContact.paginator = this.paginator;
      }
    }, error => {
      this.toastr.error(error);
    });
  }
}

