import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DataAPIManagerService } from '../services/data-apimanager.service';
import { SquadronModel } from '../model-types';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class SquadronService {

  constructor( 
    private apiManager: DataAPIManagerService,
  ) { }

  // CRUD support.
  getSquadrons(): Observable<SquadronModel[]> {
    return this.apiManager.getDataFromAPIServer(`/api/squadrons`);
  }

  getSquadronByID(id: string): Observable<SquadronModel[]> {
    return this.apiManager.getDataFromAPIServer(`/api/squadrons/${id}`);
  }

  addSquadron(id: string): Observable<SquadronModel> {
    let newSquadron: SquadronModel = {name: id}; 
    return this.apiManager.postDataToAPIServer(`/api/squadrons`, newSquadron);
  }

  // updateSquadron not implemented.

  deleteSquadron(id: string): Observable<SquadronModel[]> {
    return this.apiManager.deleteDataFromAPIServer(`/api/squadrons/${id}`);
  }
}
