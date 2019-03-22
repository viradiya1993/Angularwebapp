import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class MattersService {

  constructor(private _httpClient: HttpClient) {
  }
  /**
     * Get matters
     *
     * @returns {Promise<any>}
     */
  getMatters() {
    return this._httpClient.get('api/matters-matters');
  }


}
