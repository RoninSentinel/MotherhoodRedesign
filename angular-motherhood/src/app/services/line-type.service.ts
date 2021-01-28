import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DataAPIManagerService } from '../services/data-apimanager.service';
import { LineTypeModel } from '../model-types';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class LineTypeService {

  constructor( 
    private apiManager: DataAPIManagerService,
  ) { }

  // CRUD support.
  getLineTypes(): Observable<LineTypeModel[]> {
    return this.apiManager.getDataFromAPIServer(`/api/line-types`);
  }

  getLineTypeByID(id: string): Observable<LineTypeModel[]> {
    return this.apiManager.getDataFromAPIServer(`/api/line-types/${id}`);
  }

  addLineType(id: string): Observable<LineTypeModel> {
    let newLineType: LineTypeModel = {name: id}; 
    return this.apiManager.postDataToAPIServer(`/api/line-types`, newLineType);
  }

  // updateLineType not implemented.

  deleteLineType(id: string): Observable<LineTypeModel[]> {
    return this.apiManager.deleteDataFromAPIServer(`/api/line-types/${id}`);
  }
}
