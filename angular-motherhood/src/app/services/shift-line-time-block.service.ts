import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DataAPIManagerService } from '../services/data-apimanager.service';
import { ShiftLineTimeBlockModel } from '../model-types';
import * as moment from 'moment';
import { throttleTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShiftLineTimeBlockService {

  constructor( 
    private apiManager: DataAPIManagerService,
  ) { }

  createShiftLineTimeBlocksForLineInstance(lineInstanceID: number, shiftStartTime: Date, totalHours: number): ShiftLineTimeBlockModel[] {
    let blocksToCreate: ShiftLineTimeBlockModel[] = [];
    let totalTimeBlocks: number = totalHours / 0.5;
    const timeIncrement = 30;  // Half hour blocks.

    let blockStartTime: Date = shiftStartTime;
    let blockEndTime = moment(shiftStartTime).add(timeIncrement, 'm').toDate();
    let index: number = 0;
    let position: number;

    while (index < totalTimeBlocks) {
      position = index;
      blocksToCreate.push(new ShiftLineTimeBlockModel(0, lineInstanceID, blockStartTime, blockEndTime, null, position, null, null));

      blockStartTime = blockEndTime;
      blockEndTime = moment(blockStartTime).add(timeIncrement, 'm').toDate();

      index++;
    }

    return blocksToCreate;
  }

  // CRUD support.
  getShiftLineTimeBlocks(lineInstanceID?: number): Observable<ShiftLineTimeBlockModel[]> {
    let params = new HttpParams();
    if (lineInstanceID) {
      params = params.append('line_instance_id', lineInstanceID.toString());
    }
    return this.apiManager.getDataFromAPIServer(`/api/shift-line-time-blocks`, params);
  }

  getShiftLineTimeBlockByID(id: string): Observable<ShiftLineTimeBlockModel[]> {
    return this.apiManager.getDataFromAPIServer(`/api/shift-line-time-blocks/${id}`);
  }

  addShiftLineTimeBlock(newID: number, newLineInstanceID: number, newStartTime: Date, newEndTime: Date, newNotes: string, newPosition: number, newMissionNumber: number, newBlockCategoryID: number): Observable<ShiftLineTimeBlockModel> {
    let newShiftLineTimeBlock: ShiftLineTimeBlockModel = { 
      id: newID, 
      line_instance_id: newLineInstanceID,
      start_time: newStartTime,
      end_time: newEndTime,
      notes: newNotes,
      position: newPosition,
      mission_number: newMissionNumber,
      block_category_id: newBlockCategoryID,
    }; 
    return this.apiManager.postDataToAPIServer(`/api/shift-line-time-blocks`, newShiftLineTimeBlock);
  }

  addShiftLineTimeBlocks(newShiftLineTimeBlocks: ShiftLineTimeBlockModel[]): Observable<ShiftLineTimeBlockModel[]> {
    return this.apiManager.postDataToAPIServer(`/api/shift-line-time-blocks`, JSON.stringify(newShiftLineTimeBlocks));
  }

  updateShiftLineTimeBlock(currentID: number, newOrCurrentLineInstanceID: number, newOrCurrentStartTime: Date, newOrCurrentEndTime: Date, newOrCurrentNotes: string, newOrCurrentPosition: number, newOrCurrentMissionNumber: number, newOrCurrentBlockCategoryID: number): Observable<ShiftLineTimeBlockModel> {
    // Makes no assumptions about which of the values in the record are being changed.  
    let updatedShiftLineTimeBlock: ShiftLineTimeBlockModel = {
      id: currentID, 
      line_instance_id: newOrCurrentLineInstanceID,
      start_time: newOrCurrentStartTime,
      end_time: newOrCurrentEndTime,
      notes: newOrCurrentNotes,
      position: newOrCurrentPosition,
      mission_number: newOrCurrentMissionNumber,
      block_category_id: newOrCurrentBlockCategoryID,
    }; 
    return this.apiManager.putDataToAPIServer(`/api/shift-line-time-blocks/${currentID}`, updatedShiftLineTimeBlock);
  }

  batchUpdateShiftLineTimeBlocks(shiftLineTimeBlocks: ShiftLineTimeBlockModel[]): Observable<ShiftLineTimeBlockModel[]> {
    let timeBlocksToUpdate: any[] = []  // Keep it generic, since only updating values that can change currently by app.
    shiftLineTimeBlocks.forEach(timeBlock => {
      // Strip the objects of any non-table related fields, to allow easier processing on the API side.
      timeBlocksToUpdate.push({id: timeBlock.id,
                               notes: timeBlock.notes,
                               block_category_id: timeBlock.block_category_id ? timeBlock.block_category_id : null});  // Force a null value to be passed, in case category is removed.
                               //  All the other fields should not change.     
    });
    return this.apiManager.postDataToAPIServer(`/api/shift-line-time-blocks/batch-update`, JSON.stringify(timeBlocksToUpdate));
  }

  batchDeleteShiftLineTimeBlocks(ids: number[]): Observable<ShiftLineTimeBlockModel> {
    return this.apiManager.deleteDataFromAPIServer(`/api/shift-line-time-blocks/batch-delete`, ids);
  }

  deleteShiftLineTimeBlock(id: number): Observable<ShiftLineTimeBlockModel> {
    return this.apiManager.deleteDataFromAPIServer(`/api/shift-line-time-blocks/${id}`);
  }
}
