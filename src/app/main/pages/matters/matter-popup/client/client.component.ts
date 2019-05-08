import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  ELEMENT_DATA = [];
  name: string;
  position: number;
  weight: number;
  symbol: string;
  

  constructor() { }

  ngOnInit() {

  }

  addElement() {
    this.ELEMENT_DATA.push({position: 1, name: 'Client', weight: 1.0079, symbol: 'H'});
  }
  RemoveElement(){
    
  }
  
}
