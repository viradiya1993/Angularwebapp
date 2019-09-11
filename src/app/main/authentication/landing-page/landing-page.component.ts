import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { AuthenticationService } from '../../../_services';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LandingPageComponent implements OnInit {
  loginForm: FormGroup;
  isspiner: boolean = false;
  hide: boolean = true;
  currentYear: any;

  constructor(
    private _fuseConfigService: FuseConfigService,
    private authenticationService: AuthenticationService,
  ) {
    this.currentYear = new Date().getFullYear();
    // Configure the layout
    this._fuseConfigService.config = {
      layout: { navbar: { hidden: true }, toolbar: { hidden: true }, footer: { hidden: true }, sidepanel: { hidden: true } }
    };
  }

  ngOnInit() {
    this.authenticationService.notLogin();
  }

}
