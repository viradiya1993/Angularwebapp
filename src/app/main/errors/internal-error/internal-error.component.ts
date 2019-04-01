import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
  selector: 'app-internal-error',
  templateUrl: './internal-error.component.html',
  styleUrls: ['./internal-error.component.scss']
})
export class InternalErrorComponent implements OnInit {

  constructor(
    private _fuseConfigService: FuseConfigService
  ) {
    // Configure the layout
    this._fuseConfigService.config = {
      layout: {
        navbar: { hidden: true },
        toolbar: { hidden: true },
        footer: { hidden: true },
        sidepanel: { hidden: true }
      }
    };
  }

  ngOnInit() {
  }

}
