import { Component, OnInit } from '@angular/core';
import { MainAPiServiceService } from 'app/_services';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  constructor(private _mainAPiServiceService:MainAPiServiceService) { }

  ngOnInit() {

    this._mainAPiServiceService.getSetData({}, 'HOGetPurchases').subscribe(response=>{
      // console.log(response);
      console.log(response);
     })
  }

}
