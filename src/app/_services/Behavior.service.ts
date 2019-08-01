import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BehaviorService {
  public userPermission$: BehaviorSubject<any> = new BehaviorSubject(null);
  //for packs
  public packs$: BehaviorSubject<any> = new BehaviorSubject(null);
  public EmailGenerateData$: BehaviorSubject<any> = new BehaviorSubject(null);
  public TemplateGenerateData$: BehaviorSubject<any> = new BehaviorSubject(null);
  // public packGuid$: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(private http: HttpClient) { }

  editPermission(newPermission: any) {
    this.userPermission$.next(newPermission);
  }

  // navigation bar service 
  
  navigation(a){
    this.userPermission$.next(a);
  }

  packsitems(d){
    this.packs$.next(d);
  }
  EmailGenerateData(d){
    this.EmailGenerateData$.next(d);
  }

  TemplateGenerateData(d){
    this.TemplateGenerateData$.next(d);
  }

}