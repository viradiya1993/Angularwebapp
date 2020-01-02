import { Component, OnInit } from '@angular/core';
import { MainAPiServiceService, BehaviorService } from 'app/_services';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  ProductData: any = [];
  isLoadingResults: boolean = false;
  constructor(private _mainAPiServiceService: MainAPiServiceService,
    private behaviorService:BehaviorService) { }

  ngOnInit() {
    this._mainAPiServiceService.getSetData({}, 'HOGetPurchases').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.ProductData = response.DATA.PURCHASES;
        this.behaviorService.loadingAccountMNG('product');
      } else {
        this.behaviorService.loadingAccountMNG('product');
      }
    })
  }

}
