import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DataAPIManagerService } from '../services/data-apimanager.service';
import { TeamModel } from '../model-types';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor( 
    private apiManager: DataAPIManagerService,
  ) { }

  // CRUD support.
  getTeams(squadronID?: string): Observable<TeamModel[]> {
    let params = new HttpParams();
    if (squadronID) {
      params = params.append('squadron_id', squadronID);
    }
    return this.apiManager.getDataFromAPIServer(`/api/teams`, params);
  }

  getTeamByID(id: string): Observable<TeamModel[]> {
    return this.apiManager.getDataFromAPIServer(`/api/teams/${id}`);
  }

  addTeam(newID: number, newName: string, newSquadronID: string): Observable<TeamModel> {
    let newTeam: TeamModel = { 
      id: newID, 
      name: newName, 
      squadron_id: newSquadronID,
    }; 
    return this.apiManager.postDataToAPIServer(`/api/teams`, newTeam);
  }

  updateTeam(currentID: number, newOrCurrentName: string, newOrCurrentSquadronID: string): Observable<TeamModel> {
    // Makes no assumptions about which of the values in the record are being changed.  
    let updatedTeam: TeamModel = {
      id: currentID, 
      name: newOrCurrentName, 
      squadron_id: newOrCurrentSquadronID,
    };
    return this.apiManager.putDataToAPIServer(`/api/teams/${currentID}`, updatedTeam);
  }

  deleteTeam(id: number): Observable<TeamModel[]> {
    return this.apiManager.deleteDataFromAPIServer(`/api/teams/${id}`);
  }
}

