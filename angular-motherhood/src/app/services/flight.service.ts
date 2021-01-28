import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DataAPIManagerService } from '../services/data-apimanager.service';
import { FlightModel } from '../model-types';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor( 
    private apiManager: DataAPIManagerService,
  ) { }

  // CRUD support.
  getFlights(squadronID?: string): Observable<FlightModel[]> {
    let params = new HttpParams();
    if (squadronID) {
      params = params.append('squadron_id', squadronID);
    }
    return this.apiManager.getDataFromAPIServer(`/api/flights`, params);
  }

  getFlightByID(id: string): Observable<FlightModel[]> {
    return this.apiManager.getDataFromAPIServer(`/api/flights/${id}`);
  }

  addFlight(newID: number, newName: string, newTeamID: number, newSquadronID: string): Observable<FlightModel> {
    let newFlight: FlightModel = { 
      id: newID, 
      name: newName, 
      team_id: newTeamID,
      squadron_id: newSquadronID,
    }; 
    return this.apiManager.postDataToAPIServer(`/api/flights`, newFlight);
  }

  updateFlight(currentID: number, newOrCurrentName: string, newOrCurrentTeamID: number, newOrCurrentSquadronID: string): Observable<FlightModel> {
    // Makes no assumptions about which of the values in the record are being changed.  
    let updatedFlight: FlightModel = {
      id: currentID, 
      name: newOrCurrentName, 
      team_id: newOrCurrentTeamID,
      squadron_id: newOrCurrentSquadronID,
    };
    return this.apiManager.putDataToAPIServer(`/api/flights/${currentID}`, updatedFlight);
  }

  deleteFlight(id: string): Observable<FlightModel[]> {
    return this.apiManager.deleteDataFromAPIServer(`/api/flights/${id}`);
  }
}

