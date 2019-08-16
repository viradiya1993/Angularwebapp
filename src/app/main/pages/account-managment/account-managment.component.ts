import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import {Location} from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-account-managment',
  templateUrl: './account-managment.component.html',
  styleUrls: ['./account-managment.component.scss'],
  animations: fuseAnimations
})
export class AccountManagmentComponent implements OnInit {
  clickbtn: string;
  accountMngForm:FormGroup

  constructor(private location: Location, private router:Router,private _formBuilder: FormBuilder) 
  {
    this.nameFunction();
   }

  ngOnInit() {
    this.accountMngForm=this._formBuilder.group({
      REGISTRATIONNAME:[''],
      FIRSTNAME:[''],
      MIDDLENAME:[''],
      LASTNAME:[''],
      ADDRESS:[''],
      
      SUBURB:[''],
      ADDRESSSTATE:[''],
      POSTCODE:[''],
      PHONE:[''],
      MOBILE:[''],
      EMAIL:[''],
      ACCOUNTSEMAIL:[''],
      MANAGEREMAIL:[''],
      TECHNICALEMAIL:[''],
      REGISTEREDUNTIL:[''],
      INTROPRICEUNTIL:[''],

      
    })
  }
  basicInfoClick(){
    this.location.replaceState("/account-management/basicinfo");
    this.clickbtn="Basic Information";
  }
  ProductClick(){
    this.location.replaceState("/account-management/products");
    this.clickbtn="Products";
  }
  ReceiptsClick(){
    this.location.replaceState("/account-management/receipts");
    this.clickbtn="Receipts";
  }
  PaymentClick(){
    this.location.replaceState("/account-management/payment");
    this.clickbtn="Payment";
  }

  nameFunction(){
    if( this.router.url=="/account-management/basicinfo"){
      this.clickbtn="Basic Information";
    
    }else if(this.router.url=="/account-management/products"){
      this.clickbtn="Products";
    }
    else if(this.router.url=="/account-management/receipts"){
      this.clickbtn="Receipts";
    }
    else if(this.router.url=="/account-management/payment"){
      this.clickbtn="Payment";
    }
   
  } 
  get f() {
    return this.accountMngForm.controls;
  }
  SaveAccountDetails(){

    let Data={
      REGISTRATIONNAME:this.f.REGISTRATIONNAME.value,
      FIRSTNAME:this.f.FIRSTNAME.value,
      MIDDLENAME:this.f.MIDDLENAME.value,
      LASTNAME:this.f.LASTNAME.value,
      ADDRESS:this.f.ADDRESS.value,
      
      SUBURB:this.f.SUBURB.value,
      ADDRESSSTATE:this.f.ADDRESSSTATE.value,
      POSTCODE:this.f.POSTCODE.value,
      PHONE:this.f.PHONE.value,
      MOBILE:this.f.MOBILE.value,
      EMAIL:this.f.EMAIL.value,
      ACCOUNTSEMAIL:this.f.ACCOUNTSEMAIL.value,
      MANAGEREMAIL:this.f.MANAGEREMAIL.value,
      TECHNICALEMAIL:this.f.TECHNICALEMAIL.value,
      REGISTEREDUNTIL:this.f.REGISTEREDUNTIL.value,
      INTROPRICEUNTIL:this.f.INTROPRICEUNTIL.value,
    }
  }

  
}
