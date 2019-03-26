import { Component, OnInit } from '@angular/core';
import {ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'app-matters',
  templateUrl: './matters.component.html',
  styleUrls: ['./matters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MattersComponent implements OnInit {

  // items = Array.from({length: 100000}).map((_, i) => `Item #${i}`);
  // constructor() { }

  ngOnInit() {
  }

}
