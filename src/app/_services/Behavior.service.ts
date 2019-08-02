import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BehaviorService {
  public matterInvoice$: BehaviorSubject<any> = new BehaviorSubject(null);
  public workInProgress$: BehaviorSubject<any> = new BehaviorSubject(null);
  public userPermission$: BehaviorSubject<any> = new BehaviorSubject(null);
  //for packs
  public packs$: BehaviorSubject<any> = new BehaviorSubject(null);
  public EmailGenerateData$: BehaviorSubject<any> = new BehaviorSubject(null);
  public TemplateGenerateData$: BehaviorSubject<any> = new BehaviorSubject(null);
  // public packGuid$: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(private http: HttpClient) { }

  matterInvoiceData(matterInvoice: any) {
    this.matterInvoice$.next(matterInvoice);
  }
  setworkInProgressData(workInProgressData: any) {
    this.workInProgress$.next(workInProgressData);
  }

  packsitems(d) {
    this.packs$.next(d);
  }
  EmailGenerateData(d) {
    this.EmailGenerateData$.next(d);
  }

  TemplateGenerateData(d) {
    this.TemplateGenerateData$.next(d);
  }


}