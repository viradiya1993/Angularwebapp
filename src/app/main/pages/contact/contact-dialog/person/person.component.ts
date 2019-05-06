import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ContactService } from 'app/_services/contact.service';




@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {

  @Input() contactForm: FormGroup;

  common: { Id: number; Name: string; }[];
  getCompanyName: void;
  constructor(public _getContact: ContactService) {

  }
  /**
   * On init
   */
  ngOnInit(): void {
    this.contactForm.get('OTHERGIVENNAMES').disable();
    this.contactForm.get('OTHERFAMILYNAME').disable();
    this.contactForm.get('REASONFORCHANGE').disable();
    let data = {
      CONTACTTYPE: "Company",
      ACTIVE: "1"
    }

    this._getContact.getContact(data).subscribe(res => {
      this.getCompanyName = res.DATA.CONTACTS
    });

    this.common = [
      { Id: 1, Name: "Mr" },
      { Id: 2, Name: "Mrs" },
      { Id: 3, Name: "Miss" },
      { Id: 4, Name: "Ms" },

    ];

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
