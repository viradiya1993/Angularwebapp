import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss']
})
export class ContactDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ContactDialogComponent>) { }

  common: Common[];
  nameSelected: number;
  value: number;

  ngOnInit() {

    this.common = [

      { Id: 1, Name: "Person" },
      { Id: 2, Name: "Company" },
      { Id: 3, Name: "Party" },
      { Id: 4, Name: "Payee/Payor" },

    ];

    this.nameSelected = 1;



  }

  ondialogcloseClick(): void {
    this.dialogRef.close(false);
  }

  onClick(value) {

    console.log(value);



  }

}
export class Common {
  public Id: Number;
  public Name: string;
}