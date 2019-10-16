import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ContactSelectDialogComponent } from '../../contact-select-dialog/contact-select-dialog.component';




@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {

  @Input() contactForm: FormGroup;
  @Input() editDataCompny: any;
  @Input() errorWarningData: any;
  isContact: boolean = false;
  common: { Id: number; Name: string; }[];
  constructor(public MatDialog: MatDialog) { }
  /**
   * On init
   */
  ngOnInit(): void {
    this.contactForm.get('OTHERGIVENNAMES').disable();
    this.contactForm.get('OTHERFAMILYNAME').disable();
    this.contactForm.get('REASONFORCHANGE').disable();
    this.common = [
      { Id: 1, Name: "Mr" },
      { Id: 2, Name: "Mrs" },
      { Id: 3, Name: "Miss" },
      { Id: 4, Name: "Ms" },
    ];
    this.isContact = this.editDataCompny;
  }
  get f() {
    return this.contactForm.controls;
  }
  removeContactMatter() {
    this.isContact = true;
    this.contactForm.controls['COMPANYCONTACTGUID'].setValue('');
    this.contactForm.controls['COMPANYCONTACTGUIDTEXT'].setValue('');
  }
  SelectContactMatter() {
    const dialogRef = this.MatDialog.open(ContactSelectDialogComponent, { 
      width: '100%', 
      disableClose: true,
    data:{
      type:"fromcontact"
    } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contactForm.controls['COMPANYCONTACTGUID'].setValue(result.CONTACTGUID);
        this.contactForm.controls['COMPANYCONTACTGUIDTEXT'].setValue(result.CONTACTNAME);
        this.isContact = false;
      }
    });
  }
  triggerSomeEvent(f) {
    if (f.value.KNOWNBYOTHERNAME == true) {
      this.contactForm.get('OTHERGIVENNAMES').enable();
      this.contactForm.get('OTHERFAMILYNAME').enable();
      this.contactForm.get('REASONFORCHANGE').enable();
    } else {
      this.contactForm.controls['OTHERGIVENNAMES'].setValue("");
      this.contactForm.controls['OTHERFAMILYNAME'].setValue("");
      this.contactForm.controls['REASONFORCHANGE'].setValue("");

      this.contactForm.get('OTHERGIVENNAMES').disable();
      this.contactForm.get('OTHERFAMILYNAME').disable();
      this.contactForm.get('REASONFORCHANGE').disable();
    }
  }



}
