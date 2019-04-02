import { Component, OnInit } from '@angular/core';
import { ChronologyService } from 'app/_services/chronology.service';


@Component({
  selector: 'app-legal-details',
  templateUrl: './legal-details.component.html',
  styleUrls: ['./legal-details.component.scss']
})
export class LegalDetailsComponent implements OnInit {

  val;
  constructor(private chronology_service: ChronologyService) { }

  ngOnInit() {
  //get chronology
    this.chronology_service.getData().subscribe(res => {
      this.val = res;
      // this.filterData = res;
      console.log(this.val);
    },
    err => {
      console.log('Error occured');
    }
  );

  }

}
