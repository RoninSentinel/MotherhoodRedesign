import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DataAPIManagerService } from '../services/data-apimanager.service';
import { AORModel } from '../model-types';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class AORsService {

  constructor( 
    private apiManager: DataAPIManagerService,
  ) { }

  // CRUD support.
  getAORs(): Observable<AORModel[]> {
    return this.apiManager.getDataFromAPIServer(`/api/aors`);
  }

  getAORByID(id: string): Observable<AORModel[]> {
    return this.apiManager.getDataFromAPIServer(`/api/aors/${id}`);
    //return this.httpClient.get<AORModel>(`/api/aors/${id}`);
  }

  addAOR(id: string): Observable<AORModel> {
    let new_aor: AORModel = {name: id}; 
    return this.apiManager.postDataToAPIServer(`/api/aors`, new_aor);
  }

  // updateAOR not implemented.

  deleteAOR(id: string): Observable<AORModel[]> {
    return this.apiManager.deleteDataFromAPIServer(`/api/aors/${id}`);
    //return this.httpClient.delete(`/api/aors/${id}`);
  }
}
