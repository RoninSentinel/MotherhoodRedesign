import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DataAPIManagerService } from './data-apimanager.service';
import { QualificationsModel } from '../model-types';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class QualificationsService {

  constructor( 
    private apiManager: DataAPIManagerService,
  ) { }

  // CRUD support.
  getQualifications(crewMemberIDs?: number[]): Observable<QualificationsModel[]> {
    // May need to eventually re-factor to support a list of crewMemberIDs (API currently supports a list)
    let params = new HttpParams();
    if (crewMemberIDs) {
      params = params.append('crew_members', crewMemberIDs.join(','));
    }
    return this.apiManager.getDataFromAPIServer(`/api/qualifications`, params);
  }

  getQualificationsByID(id: string): Observable<QualificationsModel[]> {
    return this.apiManager.getDataFromAPIServer(`/api/qualifications/${id}`);
  }

  addQualifications(newID: number, newCrewMemberID: number, newQualificationTypeID: number): Observable<QualificationsModel> {
    let newQualifications: QualificationsModel = { 
      id: newID, 
      crew_member_id: newCrewMemberID, 
      qualification_type_id: newQualificationTypeID,
    }; 
    return this.apiManager.postDataToAPIServer(`/api/qualifications`, newQualifications);
  }

  updateQualifications(currentID: number, newOrCurrentCrewMemberID: number, newOrCurrentQualificationTypeID: number): Observable<QualificationsModel> {
    // Makes no assumptions about which of the values in the record are being changed.  
    let updatedQualifications: QualificationsModel = {
      id: currentID, 
      crew_member_id: newOrCurrentCrewMemberID, 
      qualification_type_id: newOrCurrentQualificationTypeID,
    };
    return this.apiManager.putDataToAPIServer(`/api/qualifications/${currentID}`, updatedQualifications);
  }

  deleteQualifications(id: number): Observable<QualificationsModel[]> {
    return this.apiManager.deleteDataFromAPIServer(`/api/qualifications/${id}`);
  }
}

