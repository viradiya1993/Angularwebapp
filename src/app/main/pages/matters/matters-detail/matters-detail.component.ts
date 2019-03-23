import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

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
  currentMatterId: any;
  currentMatter: any;
  constructor(
    private route: ActivatedRoute,
    private _mattersService: MattersService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
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
