import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BehaviorService {
  public userPermission$: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(private http: HttpClient) { }

  editPermission(newPermission: any) {
    this.userPermission$.next(newPermission);
  }
}