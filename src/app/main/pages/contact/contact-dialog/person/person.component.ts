import { Component, OnInit, Input } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ContactService } from 'app/_services/contact.service';



@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {

  @Input() loginForm: FormGroup;

  common: { Id: number; Name: string; }[];
  getCompanyName: void;
  constructor(public _getContact: ContactService)
  {
   
  }
  /**
   * On init
   */
  ngOnInit(): void
  {
    this.loginForm.get('OTHERGIVENNAMES').disable();
    this.loginForm.get('OTHERFAMILYNAME').disable();
    this.loginForm.get('REASONFORCHANGE').disable();
    let data={CONTACTTYPE:"Company",
             ACTIVE:"1"}

    this._getContact.getContact(data).subscribe(res =>{
      this.getCompanyName=res.DATA.CONTACTS
    });

  this.common = [
      { Id: 1, Name: "Mr" },
      { Id: 2, Name: "Mrs" },
      { Id: 3, Name: "Miss" },
      { Id: 4, Name: "Ms" },
    
    ];
      
  }
  triggerSomeEvent(f){
    console.log(f);
    if(f.value.KNOWNBYOTHERNAME){
      
      
      this.loginForm.get('OTHERGIVENNAMES').enable();
       this.loginForm.get('OTHERFAMILYNAME').enable();
       this.loginForm.get('REASONFORCHANGE').enable();
    }else{
      this.loginForm.get('OTHERGIVENNAMES').disable();
      this.loginForm.get('OTHERFAMILYNAME').disable();
      this.loginForm.get('REASONFORCHANGE').disable();
    }
  }

  

}
