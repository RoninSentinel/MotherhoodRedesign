import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DataAPIManagerService } from '../services/data-apimanager.service';
import { ShiftTemplateModel } from '../model-types';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class ShiftTemplateService {

  constructor( 
    private apiManager: DataAPIManagerService,
  ) { }

  // CRUD support.
  getShiftTemplates(squadronID?: string, shiftName?: string, isActive?: boolean): Observable<ShiftTemplateModel[]> {
    let params = new HttpParams();
    if (squadronID) {
      params = params.append('squadron_id', squadronID);
    }
    if (shiftName) {
      params = params.append('shift_name', shiftName);
    }
    if (typeof isActive != 'undefined') {
      params = params.append('is_active', (+isActive).toString());
    }

    return this.apiManager.getDataFromAPIServer(`/api/shift-templates`, params);
  }

  getShiftTemplateByID(id: string): Observable<ShiftTemplateModel[]> {
    return this.apiManager.getDataFromAPIServer(`/api/shift-templates/${id}`);
  }

  addShiftTemplate(newID: number, newName: string, newStartTime: Date, newEndTime: Date, newTotalHours: number, newIsActive: boolean, newSquadronID: string): Observable<ShiftTemplateModel> {
    let newShiftTemplate: ShiftTemplateModel = { 
      id: newID, 
      name: newName, 
      start_time: newStartTime,
      end_time: newEndTime,
      total_hours: newTotalHours,
      is_active: +newIsActive,  // Convert to int for database backend.
      squadron_id: newSquadronID,
    }; 
    return this.apiManager.postDataToAPIServer(`/api/shift-templates`, newShiftTemplate);
  }

  updateShiftTemplate(currentID: number, newOrCurrentName: string, newOrCurrentStartTime: Date, newOrCurrentEndTime: Date, newOrCurrentTotalHours: number, newOrCurrentIsActive: boolean, newOrCurrentSquadronID: string): Observable<ShiftTemplateModel> {
    // Makes no assumptions about which of the values in the record are being changed.  
    let updatedShiftTemplate: ShiftTemplateModel = {
      id: currentID, 
      name: newOrCurrentName, 
      start_time: newOrCurrentStartTime,
      end_time: newOrCurrentEndTime,
      total_hours: newOrCurrentTotalHours,
      is_active: +newOrCurrentIsActive,
      squadron_id: newOrCurrentSquadronID,
    };
    return this.apiManager.putDataToAPIServer(`/api/shift-templates/${currentID}`, updatedShiftTemplate);
  }

  deleteShiftTemplate(id: number): Observable<ShiftTemplateModel[]> {
    return this.apiManager.deleteDataFromAPIServer(`/api/shift-templates/${id}`);
  }
}

