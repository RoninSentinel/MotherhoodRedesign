import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DataAPIManagerService } from '../services/data-apimanager.service';
import { QualificationTypeModel } from '../model-types';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class QualificationTypeService {

  constructor( 
    private apiManager: DataAPIManagerService,
  ) { }

  // CRUD support.
  getQualificationTypes(crewMemberTypeID?: string): Observable<QualificationTypeModel[]> {
    let params = new HttpParams();
    if (crewMemberTypeID) {
      params = params.append('crew_member_type_id', crewMemberTypeID);
    }

    return this.apiManager.getDataFromAPIServer(`/api/qualification-types`, params);
  }

  getQualificationTypeByID(id: string): Observable<QualificationTypeModel[]> {
    return this.apiManager.getDataFromAPIServer(`/api/qualification-types/${id}`);
  }

  addQualificationType(newID: number, newName: string, newCrewMemberTypeID: string): Observable<QualificationTypeModel> {
    let newQualificationType: QualificationTypeModel = { 
      id: newID, 
      name: newName, 
      crew_member_type_id: newCrewMemberTypeID
    }; 
    return this.apiManager.postDataToAPIServer(`/api/qualification-types`, newQualificationType);
  }

  // TODO: Implement update function.
  updateQualificationType(currentID: number, newOrCurrentName: string, newOrCurrentCrewMemberTypeID: string): Observable<QualificationTypeModel> {
    // Makes no assumptions about which of the values in the record are being changed.  
    let updatedQualificationType: QualificationTypeModel = {
      id: currentID,
      name: newOrCurrentName,
      crew_member_type_id: newOrCurrentCrewMemberTypeID
    };
    return this.apiManager.putDataToAPIServer(`/api/qualification-types/${currentID}`, updatedQualificationType);
  }

  deleteQualificationType(id: number): Observable<QualificationTypeModel[]> {
    return this.apiManager.deleteDataFromAPIServer(`/api/qualification-types/${id}`);
  }
}
