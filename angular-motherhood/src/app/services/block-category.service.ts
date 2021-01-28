import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';

import { DataAPIManagerService } from '../services/data-apimanager.service';
import { BlockCategoryModel } from '../model-types';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class BlockCategoryService {

  private blockCategories: BlockCategoryModel[];
  private blockCategoriesChange: Subject<BlockCategoryModel[]> = new Subject<BlockCategoryModel[]>();
  blockCategories$: Observable<BlockCategoryModel[]> = this.blockCategoriesChange.asObservable();

  private _squadronFilter: string;

  constructor( 
    private apiManager: DataAPIManagerService,
  ) { 
    this.blockCategories = [];
  }

  setFilter(squadronID: string) {
    this.getBlockCategories(squadronID);
    // TODO: Handle error?
  }

  private getBlockCategories(squadronID?: string) {
    this._squadronFilter = squadronID;

    this.getBlockCategoriesFromAPI(this._squadronFilter).subscribe(data => {
      this.blockCategories = data;
      this.blockCategoriesChange.next(this.blockCategories);
    });
    
  }

  private getBlockCategoriesFromAPI(squadronID?: string): Observable<BlockCategoryModel[]> {
    let params = new HttpParams();
    if (squadronID) {
      params = params.append('squadron_id', squadronID);
    }
    return this.apiManager.getDataFromAPIServer(`/api/block-categories`, params);
  }

  getBlockCategoryByID(id: string): Observable<BlockCategoryModel[]> {
    return this.apiManager.getDataFromAPIServer(`/api/block-categories/${id}`);
  }

  addBlockCategory(newID: number, newName: string, newShortName: string, newColor: string, newIsActive: boolean, newSquadronID: string) {
    let newBlockCategory: BlockCategoryModel = { 
      id: newID, 
      name: newName, 
      short_name: newShortName,
      color: newColor,
      is_active: +newIsActive,  // Convert to integer for database tinyint storage.
      squadron_id: newSquadronID,
    }; 
    
    this.addBlockCategoryToAPI(newBlockCategory).subscribe(data => {
      this.blockCategories.push(data);
      this.blockCategoriesChange.next(this.blockCategories);
    });
  }

  private addBlockCategoryToAPI(newBlockCategory: BlockCategoryModel): Observable<BlockCategoryModel> {    
    return this.apiManager.postDataToAPIServer(`/api/block-categories`, newBlockCategory);
  }

  updateBlockCategory(currentID: number, updatedName: string, updatedShortName: string, updatedColor: string, updatedIsActive: boolean, updatedSquadronID: string) {
    // Makes no assumptions about which of the values in the record are being changed.  
    let updatedBlockCategory: BlockCategoryModel = {
      id: currentID, 
      name: updatedName, 
      short_name: updatedShortName,
      color: updatedColor,
      is_active: +updatedIsActive,  // Convert to integer for database tinyint storage.
      squadron_id: updatedSquadronID,
    };
    
    let currentBlockCategoryOnRecord: BlockCategoryModel = this.blockCategories.find(element => element.id == updatedBlockCategory.id);
    this.updateBlockCategoryToAPI(updatedBlockCategory).subscribe(data => {
      updatedBlockCategory = data;
      currentBlockCategoryOnRecord.name = updatedBlockCategory.name;
      currentBlockCategoryOnRecord.short_name = updatedBlockCategory.short_name;
      currentBlockCategoryOnRecord.color = updatedBlockCategory.color;
      currentBlockCategoryOnRecord.is_active = updatedBlockCategory.is_active;
      currentBlockCategoryOnRecord.squadron_id = updatedBlockCategory.squadron_id;

      this.blockCategoriesChange.next(this.blockCategories);
    });
  }

  private updateBlockCategoryToAPI(updatedBlockCategory: BlockCategoryModel): Observable<BlockCategoryModel> {
    return this.apiManager.putDataToAPIServer(`/api/block-categories/${updatedBlockCategory.id}`, updatedBlockCategory);
  }

  deleteBlockCategory(id: string) {
    this.deleteBlockCategoryFromAPI(id).subscribe(data => {
      this.blockCategories = this.blockCategories.filter(blockCategory => blockCategory.id != +id);
      this.blockCategoriesChange.next(this.blockCategories);
    });
  }

  private deleteBlockCategoryFromAPI(id: string): Observable<BlockCategoryModel[]> {
    return this.apiManager.deleteDataFromAPIServer(`/api/block-categories/${id}`);
  }
}

