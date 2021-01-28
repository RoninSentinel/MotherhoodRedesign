import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

import { DataAPIManagerService } from '../services/data-apimanager.service';
import { LineInstanceModel } from '../model-types';


@Injectable({
  providedIn: 'root'
})
export class LineInstanceService {

  constructor( 
    private apiManager: DataAPIManagerService,
    private datePipe: DatePipe,
  ) { }

  // CRUD support.
  getLineInstances(date?: Date, shiftName?: string, squadronID?: string): Observable<LineInstanceModel[]> {
    let params = new HttpParams();

    if (date) {
      params = params.append('date', this.datePipe.transform(date, 'yyyy-MM-dd', 'UTC'));
    }

    if (shiftName) {
      params = params.append('shift_name', shiftName);
    }
    
    if (squadronID) {
      params = params.append('squadron_id', squadronID);
    }

    return this.apiManager.getDataFromAPIServer(`/api/line-instances`, params);
  }

  getLineInstanceByID(id: number): Observable<LineInstanceModel[]> {
    return this.apiManager.getDataFromAPIServer(`/api/line-instances/${id}`);
  }

  addLineInstance(newID: number, newLineTemplateID: number, newShiftTemplateInstanceID: number): Observable<LineInstanceModel> {
    let newLineInstance: LineInstanceModel = { 
      id: newID, 
      line_template_id: newLineTemplateID, 
      shift_template_instance_id: newShiftTemplateInstanceID,
    }; 
    return this.apiManager.postDataToAPIServer(`/api/line-instances`, newLineInstance);
  }

  addLineInstances(newLineInstances: LineInstanceModel[]): Observable<LineInstanceModel[]> {
    return this.apiManager.postDataToAPIServer(`/api/line-instances/batch-create`, JSON.stringify(newLineInstances));
  }

  updateLineInstance(currentID: number, newOrCurrentLineTemplateID: number, newOrCurrentShiftTemplateInstanceID: number): Observable<LineInstanceModel> {
    // Makes no assumptions about which of the values in the record are being changed.  
    let updatedShiftTemplate: LineInstanceModel = {
      id: currentID, 
      line_template_id: newOrCurrentLineTemplateID, 
      shift_template_instance_id: newOrCurrentShiftTemplateInstanceID,
    };
    return this.apiManager.putDataToAPIServer(`/api/line-instances/${currentID}`, updatedShiftTemplate);
  }

  batchDeleteLineInstances(ids: number[]): Observable<LineInstanceModel> {
    return this.apiManager.deleteDataFromAPIServer(`/api/line-instances/batch-delete`, ids);
  }

  deleteLineInstance(id: number): Observable<LineInstanceModel[]> {
    return this.apiManager.deleteDataFromAPIServer(`/api/line-instances/${id}`);
  }
}

