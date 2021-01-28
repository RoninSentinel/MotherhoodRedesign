import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DataAPIManagerService } from '../services/data-apimanager.service';
import { CrewMemberModel } from '../model-types';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class CrewMemberService {

  constructor( 
    private apiManager: DataAPIManagerService,
  ) { }

  // CRUD support.
  getCrewMembers(squadronID?: string): Observable<CrewMemberModel[]> {
    let params = new HttpParams();
    if (squadronID) {
      params = params.append('squadron_id', squadronID);
    }
    return this.apiManager.getDataFromAPIServer(`/api/crew-members`, params);
  }

  getCrewMemberByID(id: string): Observable<CrewMemberModel[]> {
    return this.apiManager.getDataFromAPIServer(`/api/crew-members/${id}`);
  }

  addCrewMember(newID: number, newRank: string, newLastName: string, newFirstName: string, newMiddleInitial: string, newCallSign: string, newCrewMemberTypeID: string, newSquadronID: string, newFlightID: number): Observable<CrewMemberModel> {
    let newCrewMember: CrewMemberModel = { 
      id: newID, 
      rank: newRank,
      last_name: newLastName,
      first_name: newFirstName,
      middle_initial: newMiddleInitial,
      call_sign: newCallSign,
      crew_member_type_id: newCrewMemberTypeID,
      squadron_id: newSquadronID,
      flight_id: newFlightID,
    }; 
    return this.apiManager.postDataToAPIServer(`/api/crew-members`, newCrewMember);
  }

  updateCrewMember(currentID: number, newOrCurrentRank: string, newOrCurrentLastName: string, newOrCurrentFirstName: string, newOrCurrentMiddleInitial: string, newOrCurrentCallSign: string, newOrCurrentCrewMemberTypeID: string, newOrCurrentSquadronID: string, newOrCurrentFlightID: number): Observable<CrewMemberModel> {
    // Makes no assumptions about which of the values in the record are being changed.  
    let updatedCrewMember: CrewMemberModel = {
      id: currentID, 
      rank: newOrCurrentRank,
      last_name: newOrCurrentLastName,
      first_name: newOrCurrentFirstName,
      middle_initial: newOrCurrentMiddleInitial,
      call_sign: newOrCurrentCallSign,
      crew_member_type_id: newOrCurrentCrewMemberTypeID,
      squadron_id: newOrCurrentSquadronID,
      flight_id: newOrCurrentFlightID,
    };
    return this.apiManager.putDataToAPIServer(`/api/crew-members/${currentID}`, updatedCrewMember);
  }

  deleteCrewMember(id: number): Observable<CrewMemberModel[]> {
    return this.apiManager.deleteDataFromAPIServer(`/api/crew-members/${id}`);
  }
}

