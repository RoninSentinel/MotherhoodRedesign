import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataAPIManagerService } from '../services/data-apimanager.service';
import { CrewMemberShiftLineTimeBlocksModel } from '../model-types';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CrewMemberShiftLineTimeBlockService {

  constructor( 
    private apiManager: DataAPIManagerService,
    private datePipe: DatePipe,
  ) { }

  createGenericCrewMemberShiftLineTimeBlocksForShiftLineTimeBlock(shiftLineTimeBlockID: number): CrewMemberShiftLineTimeBlocksModel[] {
    let blocksToCreate: CrewMemberShiftLineTimeBlocksModel[] = [];
    let crewPositions: number[] = [0, 1, 2, 3];   // Pilot, Sensor Operator, IP, ISO.
    let crewMemberID = null;  // Crew members unknown.

    crewPositions.forEach(position =>
      blocksToCreate.push(new CrewMemberShiftLineTimeBlocksModel(0, crewMemberID, shiftLineTimeBlockID, position))
    );

    return blocksToCreate;
  }

  // CRUD support.
  getCrewMemberShiftLineTimeBlocks(crewMemberID?: number, shiftLineTimeBlockID?: number, date?: Date, squadronID?: string, shiftName?: string): Observable<CrewMemberShiftLineTimeBlocksModel[]> {
    let params = new HttpParams();
    if(crewMemberID) {
      params = params.append('crew_member_id', crewMemberID.toString());
    }

    if (shiftLineTimeBlockID) {
      params = params.append('shift_line_time_block_id', shiftLineTimeBlockID.toString());
    }

    if (date) {
      params = params.append('date', this.datePipe.transform(date, 'yyyy-MM-dd', 'UTC'));
    }

    if (squadronID) {
      params = params.append('squadron_id', squadronID);
    }

    if (shiftName) {
      params = params.append('shift_name', shiftName);
    }

    return this.apiManager.getDataFromAPIServer(`/api/crew-shift-line-time-blocks`, params);
  }

  getCrewMemberShiftLineTimeBlockByID(id: string): Observable<CrewMemberShiftLineTimeBlocksModel[]> {
    return this.apiManager.getDataFromAPIServer(`/api/crew-shift-line-time-blocks/${id}`);
  }

  addCrewMemberShiftLineTimeBlock(newID: number, newCrewMemberID: number, newShiftLineTimeBlockID: number, newPosition: number): Observable<CrewMemberShiftLineTimeBlocksModel> {
    let newCrewMemberShiftLineTimeBlock: CrewMemberShiftLineTimeBlocksModel = { 
      id: newID, 
      crew_member_id: newCrewMemberID,
      shift_line_time_block_id: newShiftLineTimeBlockID,
      position: newPosition,
    }; 
    return this.apiManager.postDataToAPIServer(`/api/crew-shift-line-time-blocks`, newCrewMemberShiftLineTimeBlock);
  }

  addCrewMemberShiftLineTimeBlocks(newCrewMemberShiftLineTimeBlocks: CrewMemberShiftLineTimeBlocksModel[]): Observable<CrewMemberShiftLineTimeBlocksModel[]> {
    return this.apiManager.postDataToAPIServer(`/api/crew-shift-line-time-blocks`, JSON.stringify(newCrewMemberShiftLineTimeBlocks));
  }

  updateCrewMemberShiftLineTimeBlock(currentID: number, newOrCurrentCrewMemberID: number, newOrCurrentShiftLineTimeBlockID: number, newOrCurrentPosition: number): Observable<CrewMemberShiftLineTimeBlocksModel> {
    // Makes no assumptions about which of the values in the record are being changed.  
    let updatedShiftLineTimeBlock: CrewMemberShiftLineTimeBlocksModel = {
      id: currentID, 
      crew_member_id: newOrCurrentCrewMemberID,
      shift_line_time_block_id: newOrCurrentShiftLineTimeBlockID,
      position: newOrCurrentPosition,
    }; 
    return this.apiManager.putDataToAPIServer(`/api/crew-shift-line-time-blocks/${currentID}`, updatedShiftLineTimeBlock);
  }

  batchUpdateCrewMemberShiftLineTimeBlocks(uuid: string, date: Date, squadron: string, shift: string, crewMemberShiftLineTimeBlocks: CrewMemberShiftLineTimeBlocksModel[]): Observable<CrewMemberShiftLineTimeBlocksModel[]> {
    let timeBlocksToUpdate: CrewMemberShiftLineTimeBlocksModel[] = []
    crewMemberShiftLineTimeBlocks.forEach(timeBlock => {
      // Strip the objects of any non-table related fields, to allow easier processing on the API side.
      timeBlocksToUpdate.push({id: timeBlock.id,
                               crew_member_id: timeBlock.crew_member ? timeBlock.crew_member.id : null,  // Force a null value to be passed, in case crew member removed.
                               shift_line_time_block_id: timeBlock.shift_line_time_block_id,
                               position: timeBlock.position})
    });

    // The batch update is used as part of the publish feature.  Include additional "meta" data to facilitate easier broadcasting on backend.
    let content = {
      _uuid: uuid,
      _date: date,
      _squadron: squadron,
      _shift: shift,
      data: timeBlocksToUpdate,
    }

    return this.apiManager.postDataToAPIServer(`/api/crew-shift-line-time-blocks/batch-update`, JSON.stringify(content));
  }

  batchDeleteCrewMemberShiftLineTimeBlocks(ids: number[]): Observable<CrewMemberShiftLineTimeBlocksModel> {
    return this.apiManager.deleteDataFromAPIServer(`/api/crew-shift-line-time-blocks/batch-delete`, ids);
  }

  deleteCrewMemberShiftLineTimeBlock(id: number): Observable<CrewMemberShiftLineTimeBlocksModel[]> {
    return this.apiManager.deleteDataFromAPIServer(`/api/crew-shift-line-time-blocks/${id}`);
  }
}
