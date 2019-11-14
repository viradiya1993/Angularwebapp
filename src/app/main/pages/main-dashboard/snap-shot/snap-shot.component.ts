import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MainAPiServiceService } from 'app/_services';

@Component({
  selector: 'app-snap-shot',
  templateUrl: './snap-shot.component.html',
  styleUrls: ['./snap-shot.component.scss'],
  animations: fuseAnimations
})
export class SnapShotComponent implements OnInit {

  isLoadingResults: boolean = false;

  addData:any=[];
  constructor(private _mainAPiServiceService:MainAPiServiceService,
    private toastr: ToastrService,) { }

  ngOnInit() {

  


}
}