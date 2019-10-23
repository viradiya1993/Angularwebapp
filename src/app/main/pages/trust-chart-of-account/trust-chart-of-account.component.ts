import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-trust-chart-of-account',
  templateUrl: './trust-chart-of-account.component.html',
  styleUrls: ['./trust-chart-of-account.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class TrustChartOfAccountComponent implements OnInit {
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  isLoadingResults: boolean = false;  
 
  constructor() {}
 
  ngOnInit() {
  }
  //FilterSearch
  FilterSearch(){

  }
  //AccountType
  AccountType(value){
    console.log(value);
  }
  //Refersh
  refreshturstcAC(){

  }
  

}
