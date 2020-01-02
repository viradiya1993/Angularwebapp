import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BehaviorService } from 'app/_services';

@Component({
  selector: 'app-account-managment',
  templateUrl: './account-managment.component.html',
  styleUrls: ['./account-managment.component.scss'],
  animations: fuseAnimations
})
export class AccountManagmentComponent implements OnInit {
  clickbtn: string;
  isLoadingResults: boolean = false;
  constructor(private location: Location, private router: Router, private _formBuilder: FormBuilder,
    private behaviorService:BehaviorService) {
    this.nameFunction();
    this.loading_fun();
  }

  ngOnInit() {
  }
  basicInfoClick() {
    this.location.replaceState("/account-management/basicinfo");
    this.clickbtn = "Basic Information";
  }
  ProductClick() {
    this.location.replaceState("/account-management/products");
    this.clickbtn = "Products";
  }
  ReceiptsClick() {
    this.location.replaceState("/account-management/receipts");
    this.clickbtn = "Receipts";
  }
  PaymentClick() {
    this.location.replaceState("/account-management/payment");
    this.clickbtn = "Payment";
  }

  nameFunction() {
    if (this.router.url == "/account-management/basicinfo") {
      this.clickbtn = "Basic Information";

    } else if (this.router.url == "/account-management/products") {
      this.clickbtn = "Products";
    }
    else if (this.router.url == "/account-management/receipts") {
      this.clickbtn = "Receipts";
    }
    else if (this.router.url == "/account-management/payment") {
      this.clickbtn = "Payment";
    }

  }

 loading_fun(){
  this.isLoadingResults = true;
  this.behaviorService.loadingAccountMNG(null);
  this.behaviorService.loadingAccountMNG$.subscribe(result=>{
    if(result){
      this.isLoadingResults = false;
    }
  })
}
}
