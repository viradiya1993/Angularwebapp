import { Component, OnInit, Pipe, PipeTransform, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-licence-agreement',
  templateUrl: './licence-agreement.component.html',
  styleUrls: ['./licence-agreement.component.scss']
})
export class LicenceAgreementComponent implements OnInit {
  isLicence: any;
  ProductType: any;
  currentYear: any;
  defultTheme: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<LicenceAgreementComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.isLicence = data.action;
    if (data.action != 'MD') {
      let currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.ProductType = currentUser.ProductType;
      this.currentYear = new Date().getFullYear();
      if (localStorage.getItem('theme_type') == "theme-yellow-light")
        this.defultTheme = true;
    }
  }

  ngOnInit() {
  }

}
