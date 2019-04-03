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
  dataSource = new MatTableDataSource(this.MatterContact);
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
    this.dataSource.paginator = this.paginator;
    this.route.url.subscribe(v =>
      this.currentMatterId = v[0].path
    );
    // currentMatterId
    this._mattersService.getMattersDetail(this.currentMatterId).subscribe(response => {
      if (response.Matter.response == "error - not logged in") {
        this.toastr.error(response.Matter.response);
      } else {
        this.currentMatter = response.Matter.DataSet[0];
      }
    });
    this._mattersService.getMattersContact(this.currentMatterId).subscribe(response => {
      if (response.MatterContact.response == "error - not logged in") {
        this.toastr.error(response.MatterContact.response);
      } else {
        this.MatterContact = response.MatterContact.DataSet;
      }
    });
  }
}

