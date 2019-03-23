import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-matters-detail',
  templateUrl: './matters-detail.component.html',
  styleUrls: ['./matters-detail.component.scss']
})
export class MattersDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data.subscribe(v => console.log(v));
  }

}
