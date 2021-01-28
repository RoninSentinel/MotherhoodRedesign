import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

import { DataAPIManagerService } from '../services/data-apimanager.service';
import { ShiftTemplateInstanceModel } from '../model-types';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class ShiftTemplateInstanceService {

  constructor( 
    private apiManager: DataAPIManagerService,
    private datePipe: DatePipe,
  ) { }

  // CRUD support.
  getShiftTemplateInstances(date: Date, shiftTemplateID: number): Observable<ShiftTemplateInstanceModel[]> {
    let params = new HttpParams();
    params = params.append('date', this.datePipe.transform(date, 'yyyy-MM-dd', 'UTC'));
    params = params.append('shift_template_id', shiftTemplateID.toString());
    
    return this.apiManager.getDataFromAPIServer(`/api/shift-template-instances`, params);
  }

  getShiftTemplateInstanceByID(id: number): Observable<ShiftTemplateInstanceModel[]> {
    return this.apiManager.getDataFromAPIServer(`/api/shift-template-instances/${id}`);
  }

  addShiftTemplateInstance(newID: number, newTemplateID: number, newDate: Date): Observable<ShiftTemplateInstanceModel> {
    // let newShiftTemplateInstance: ShiftTemplateInstanceModel = { // Get around the headache of the Date object not playing nicely with JSON and mySQL.
    let newShiftTemplateInstance = {  // Same format as ShiftTemplateInstanceModel, but avoiding the Date object.
      id: newID, 
      shift_template_id: newTemplateID, 
      // https://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetime
      date: newDate.toISOString().slice(0, 19).replace('T', ' '),
    }; 
    return this.apiManager.postDataToAPIServer(`/api/shift-template-instances`, newShiftTemplateInstance);
  }

  updateShiftTemplateInstance(currentID: number, newOrCurrentShiftTemplateID: number, newOrCurrentDate: Date): Observable<ShiftTemplateInstanceModel> {
    // Makes no assumptions about which of the values in the record are being changed.  
    let updatedShiftTemplate: ShiftTemplateInstanceModel = {
      id: currentID, 
      shift_template_id: newOrCurrentShiftTemplateID,
      date: newOrCurrentDate,
      //date: newOrCurrentDate.toISOString().slice(0, 19).replace('T', ' '),
    };
    return this.apiManager.putDataToAPIServer(`/api/shift-template-instances/${currentID}`, updatedShiftTemplate);
  }

  deleteShiftTemplateInstance(id: number): Observable<ShiftTemplateInstanceModel[]> {
    return this.apiManager.deleteDataFromAPIServer(`/api/shift-template-instances/${id}`);
  }
}

