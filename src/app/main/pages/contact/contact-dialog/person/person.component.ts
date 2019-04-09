import { Component, OnInit } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {


  //form: FormGroup;

  

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {FormBuilder} _formBuilder
   */
  constructor(
     // private _formBuilder: FormBuilder
  )
  {
      // Set the private defaults
      this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  {
      // Reactive Form
      // this.form = this._formBuilder.group({
      //     company   : [
      //         {
      //             value   : 'Google',
      //             disabled: true
      //         }, Validators.required
      //     ],
      //     firstName : ['', Validators.required],
      //     lastName  : ['', Validators.required],
      //     address   : ['', Validators.required],
      //     address2  : ['', Validators.required],
      //     city      : ['', Validators.required],
      //     state     : ['', Validators.required],
      //     postalCode: ['', [Validators.required, Validators.maxLength(5)]],
      //     country   : ['', Validators.required]
      // });

      
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }
  

  

}
