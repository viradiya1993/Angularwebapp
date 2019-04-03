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
    this._mattersService.getMattersDetail(this.currentMatterId).subscribe(response => {
      localStorage.setItem('session_token', response.Matter.SessionToken);
      if (response.Matter.response != "error - not logged in") {
        this.currentMatter = response.Matter.DataSet[0];
      } else {
        this.toastr.error(response.Matter.response);
      }
    }, error => {
      this.toastr.error(error);
    });
    this._mattersService.getMattersContact(this.currentMatterId).subscribe(response => {
      localStorage.setItem('session_token', response.MatterContact.SessionToken);
      if (response.MatterContact.response != "error - not logged in") {
        this.MatterContact = new MatTableDataSource(response.MatterContact.DataSet);
        this.MatterContact.paginator = this.paginator;
      } else {
        this.toastr.error(response.MatterContact.response);
      }
    }, error => {
      this.toastr.error(error);
    });
  }
}

