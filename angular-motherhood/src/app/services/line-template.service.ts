import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DataAPIManagerService } from '../services/data-apimanager.service';
import { LineTemplateModel } from '../model-types';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class LineTemplateService {

  constructor( 
    private apiManager: DataAPIManagerService,
  ) { }

  // CRUD support.
  getLineTemplates(squadronID?: string, isActive?: boolean, name?: string): Observable<LineTemplateModel[]> {
    let params = new HttpParams();
    if (squadronID) {
      params = params.append('squadron_id', squadronID);
    }

    if (typeof isActive!='undefined') {
      params = params.append('is_active', (+isActive).toString());
    }

    if (name) {
      params = params.append('name', name);
    }
    
    return this.apiManager.getDataFromAPIServer(`/api/line-templates`, params);
  }

  getLineTemplateByID(id: string): Observable<LineTemplateModel[]> {
    return this.apiManager.getDataFromAPIServer(`/api/line-templates/${id}`);
  }

  addLineTemplate(newID: number, newName: string, newLineTypeID: number, newColor: string, newIsActive: boolean, newOrderPreference: number, newCallSign: string, newSquadronID: string, newAORID: string, newIsHiddenInReadMode: boolean, newExtraFieldName: string): Observable<LineTemplateModel> {
    let newLineTemplate: LineTemplateModel = { 
      id: newID, 
      name: newName, 
      line_type_id: newLineTypeID,
      color: newColor,
      is_active: +newIsActive, // Convert to integer for database tinyint storage.
      order_preference: newOrderPreference,
      call_sign: newCallSign,
      squadron_id: newSquadronID,
      aor_id: newAORID,
      is_hidden_in_read_mode: +newIsHiddenInReadMode, // Convert to integer for database tinyint storage.
      extra_field_name: newExtraFieldName,
    }; 

    return this.apiManager.postDataToAPIServer(`/api/line-templates`, newLineTemplate);
  }

  updateLineTemplate(currentID: number, newOrCurrentName: string, newOrCurrentLineTypeID: number, newOrCurrentColor: string, newOrCurrentIsActive: boolean, newOrCurrentOrderPreference: number, newOrCurrentCallSign: string, newOrCurrentSquadronID: string, newOrCurrentAORID: string, newOrCurrentIsHiddenInReadMode: boolean, newOrCurrentExtraFieldName: string): Observable<LineTemplateModel> {
    // Makes no assumptions about which of the values in the record are being changed.  
    let updatedLineTemplate: LineTemplateModel = {
      id: currentID, 
      name: newOrCurrentName, 
      line_type_id: newOrCurrentLineTypeID,
      color: newOrCurrentColor,
      is_active: +newOrCurrentIsActive, // Convert to integer for database tinyint storage.
      order_preference: newOrCurrentOrderPreference,
      call_sign: newOrCurrentCallSign,
      squadron_id: newOrCurrentSquadronID,
      aor_id: newOrCurrentAORID,
      is_hidden_in_read_mode: +newOrCurrentIsHiddenInReadMode, // Convert to integer for database tinyint storage.
      extra_field_name: newOrCurrentExtraFieldName,
    };
    return this.apiManager.putDataToAPIServer(`/api/line-templates/${currentID}`, updatedLineTemplate);
  }

  deleteLineTemplate(id: number): Observable<LineTemplateModel[]> {
    return this.apiManager.deleteDataFromAPIServer(`/api/line-templates/${id}`);
  }
}

