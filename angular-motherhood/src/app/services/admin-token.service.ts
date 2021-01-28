import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DataAPIManagerService } from '../services/data-apimanager.service';
import { AdminTokenModel } from '../model-types';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class AdminTokenService {

  constructor( 
    private apiManager: DataAPIManagerService,
  ) { }

  // CRUD support.
  getAdminTokens(squadronID?: string, is_active?: boolean, code?: string): Observable<AdminTokenModel[]> {
    let params = new HttpParams();
    if (squadronID) {
      params = params.append('squadron_id', squadronID);
    }

    if (typeof is_active!='undefined') {
      params = params.append('is_active', (+is_active).toString());
    }

    if (code) {
      params = params.append('code', code);
    }
    
    return this.apiManager.getDataFromAPIServer(`/api/admin-tokens`, params);
  }

  getAdminTokenByID(id: string): Observable<AdminTokenModel[]> {
    return this.apiManager.getDataFromAPIServer(`/api/admin-tokens/${id}`);
  }

  addAdminToken(newID: number, newCode: string, newAccessLevel: string, newSquadronID: string, newIsActive: boolean): Observable<AdminTokenModel> {
    let newAdminToken: AdminTokenModel = { 
      id: newID, 
      code: newCode, 
      access_level: newAccessLevel,
      squadron_id: newSquadronID,
      is_active: +newIsActive, // Convert to integer for database tinyint storage.
    }; 

    return this.apiManager.postDataToAPIServer(`/api/admin-tokens`, newAdminToken);
  }

  updateAdminToken(currentID: number, newOrCurrentCode: string, newOrCurrentAccessLevel: string, newOrCurrentSquadronID: string, newOrCurrentIsActive: boolean): Observable<AdminTokenModel> {
    // Makes no assumptions about which of the values in the record are being changed.  
    let updatedAdminToken: AdminTokenModel = {
      id: currentID, 
      code: newOrCurrentCode, 
      access_level: newOrCurrentAccessLevel,
      squadron_id: newOrCurrentSquadronID,
      is_active: +newOrCurrentIsActive, // Convert to integer for database tinyint storage.
    };
    return this.apiManager.putDataToAPIServer(`/api/admin-tokens/${currentID}`, updatedAdminToken);
  }

  deleteAdminToken(id: number): Observable<AdminTokenModel[]> {
    return this.apiManager.deleteDataFromAPIServer(`/api/admin-tokens/${id}`);
  }
}

