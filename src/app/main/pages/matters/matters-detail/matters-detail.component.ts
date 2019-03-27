import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';

import { MattersService } from '../matters.service';

@Component({
  selector: 'app-matters-detail',
  templateUrl: './matters-detail.component.html',
  styleUrls: ['./matters-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MattersDetailComponent implements OnInit {
  displayedColumns: string[] = ['service', 'quantity_from_10', 'price_from', 'price_from_inc', 'quantity_to', 'price_to', 'price_toinc'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  currentMatterId: any;
  currentMatter: any;
  constructor(
    private route: ActivatedRoute,
    private _mattersService: MattersService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.route.url.subscribe(v =>
      this.currentMatterId = v[0].path
    );
    this.currentMatter = {
      'id': '5725a680b3249760ea21de52',
      'name': 'Abbott',
      'lastName': 'Keitch',
      'avatar': 'assets/images/avatars/Abbott.jpg',
      'nickname': 'Royalguard',
      'company': 'Saois',
      'jobTitle': 'Digital Archivist',
      'email': 'abbott@withinpixels.com',
      'phone': '+1-202-555-0175',
      'address': '933 8th Street Stamford, CT 06902',
      'birthday': '',
      'notes': ''
    };
  }

}
export interface PeriodicElement {
  service: string;
  quantity_from_10: number;
  price_from: number;
  price_from_inc: number;
  quantity_to: number;
  price_to: number;
  price_toinc: number;
}

const ELEMENT_DATA: PeriodicElement[] = [

];
