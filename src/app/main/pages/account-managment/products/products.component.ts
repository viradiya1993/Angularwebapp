import { Component, OnInit } from '@angular/core';
import { MainAPiServiceService } from 'app/_services';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  ProductData: any = [];
  isLoadingResults: boolean = false;
  constructor(private _mainAPiServiceService: MainAPiServiceService) { }

  ngOnInit() {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({}, 'HOGetPurchases').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.ProductData = response.DATA.PURCHASES;
        this.isLoadingResults = false;
      } else {
        this.isLoadingResults = false;
      }
    })
  }

}
