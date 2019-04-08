import { Component, OnInit, Input } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';



@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {

  @Input() loginForm: FormGroup;

  // Private
  private _unsubscribeAll: Subject<any>;


  constructor(
    // private _formBuilder: FormBuilder
    
  )
  {
   
  }

  
  /**
   * On init
   */
  ngOnInit(): void
  {
      // console.log(this.loginForm);debugger;
      // this.loginForm = this._formBuilder.group({
     
      
      //   company: ['', Validators.required]      });
      
  }

  

}
