import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  
  isDisabled = false;
  constructor() { }

  ngOnInit() {
  }

  triggerSomeEvent() {
   
    this.isDisabled = !this.isDisabled;
    return;
    
}

}
