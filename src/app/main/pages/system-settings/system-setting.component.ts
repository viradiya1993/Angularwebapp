import { Component, OnInit } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-system-setting',
  templateUrl: './system-setting.component.html',
  styleUrls: ['./system-setting.component.scss'],
  animations: fuseAnimations
})
export class SystemSettingComponent implements OnInit {
  a: string;
  button:string;
  ForDataBind: any;
  SettingForm: FormGroup;

  constructor(public router: Router,    private _formBuilder: FormBuilder,) { 
    this.nameFunction();
  }

  ngOnInit() {
    // this.button='name';
    // this.ForDataBind="Name";
    // this.router.url === '/login'
    
    // this.router.navigate(['time-billing/work-in-progress/invoice']);
    this.SettingForm=this._formBuilder.group({
      NAME:['']
    })
  }


  nameFunction(){
    if( this.router.url=="/system-setting/business"){
      this.ForDataBind="Business";
    }else if(this.router.url=="/system-setting/name"){  
      this.ForDataBind="Name";
    }
    else if(this.router.url=="/system-setting/defaults"){  
      this.ForDataBind="Defaults";
    }
    else if(this.router.url=="/system-setting/estimates"){  
      this.ForDataBind="Estimates";
    }
    else if(this.router.url=="/system-setting/reginoal"){  
      this.ForDataBind="Reginoal";
    }
    else if(this.router.url=="/system-setting/trust"){  
      this.ForDataBind="Trust";
    }
    else if(this.router.url=="/system-setting/templates"){  
      this.ForDataBind="Templates";
    }
  }
  get f() {
    //console.log(this.contactForm);
    return this.SettingForm.controls;
  }
  save(){
    console.log("fhusdgf");
    console.log(this.f);
  }

}
