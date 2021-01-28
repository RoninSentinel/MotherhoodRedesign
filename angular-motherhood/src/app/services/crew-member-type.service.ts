import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DataAPIManagerService } from '../services/data-apimanager.service';
import { CrewMemberTypeModel } from '../model-types';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class CrewMemberTypeService {

  constructor( 
    private apiManager: DataAPIManagerService,
  ) { }

  // CRUD support.
  getCrewMemberTypes(): Observable<CrewMemberTypeModel[]> {
    return this.apiManager.getDataFromAPIServer(`/api/crew-member-types`);
  }

  getCrewMemberTypeByID(id: string): Observable<CrewMemberTypeModel[]> {
    return this.apiManager.getDataFromAPIServer(`/api/crew-member-types/${id}`);
  }

  addCrewMemberType(id: string): Observable<CrewMemberTypeModel> {
    let newCrewMemberType: CrewMemberTypeModel = {name: id}; 
    return this.apiManager.postDataToAPIServer(`/api/crew-member-types`, newCrewMemberType);
  }

  // updateCrewMemberType not implemented.

  deleteCrewMemberType(id: string): Observable<CrewMemberTypeModel[]> {
    return this.apiManager.deleteDataFromAPIServer(`/api/crew-member-types/${id}`);
  }
}
