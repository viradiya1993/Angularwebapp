import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService } from 'app/_services';


@Component({
  selector: 'app-globally-Authority',
  templateUrl: './globally-authority.component.html',
  styleUrls: ['./globally-authority.component.scss'],
  animations: fuseAnimations
})
export class GloballyAuthorityComponent implements OnInit {

  constructor(private _mainAPiServiceService: MainAPiServiceService) { }

  ngOnInit() {
    // this._mainAPiServiceService.getSetData({}, 'GetSystem').subscribe(response=>{
    //   this.addData=response.DATA.SYSTEM.ADDRESSGROUP.POSTALADDRESSGROUP
    // })

  }



}