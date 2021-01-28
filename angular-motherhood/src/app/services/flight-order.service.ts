import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { CrewMemberModel, FlightOrdersModel, QualificationsModel } from '../model-types';
import { DataAPIManagerService } from './data-apimanager.service';
import { QualificationsService } from './qualifications.service';

@Injectable({
  providedIn: 'root'
})
export class FlightOrderService {

  private flightOrders: FlightOrdersModel[] = [];
  private flightOrdersChange: Subject<FlightOrdersModel[]> = new Subject<FlightOrdersModel[]>();
  flightOrders$: Observable<FlightOrdersModel[]> = this.flightOrdersChange.asObservable();

  private _dateFilter: Date;
  private _shiftTemplateInstanceID: number;

  constructor( 
    private apiManager: DataAPIManagerService,
    private datePipe: DatePipe,
    public qualificationsService: QualificationsService,
  ) {
    this.flightOrders = [];
   }

  setFlightOrders(flightOrders: FlightOrdersModel[]) {
    this.flightOrders = flightOrders;
    this.flightOrdersChange.next(this.flightOrders);
  }

  setDateFilter(date: Date) {
    this._dateFilter = date;
  }

  setShiftTemplateInstanceIDFilter(shiftTemplateInstanceID: number) {
    this._shiftTemplateInstanceID = shiftTemplateInstanceID
  }

  addCrewMemberToFlightOrders(crewMember: CrewMemberModel) {
    if (crewMember) {
      if(!this.flightOrders.find(flightOrder => flightOrder.crew_member_id == crewMember.id)) {
        // Only add the crew member if they aren't on the flight orders already.
        let newFlightOrder: FlightOrdersModel = new FlightOrdersModel(0,
                                                                      crewMember.id,
                                                                      this._dateFilter,
                                                                      this._shiftTemplateInstanceID,
                                                                      0,
                                                                      crewMember);
        this.flightOrders.push(newFlightOrder);
        this.flightOrdersChange.next(this.flightOrders);

      }
        
    }

  }

  removeCrewMemberFromFlightOrders(crewMemberID: number) {
    let flightOrderToDelete = this.flightOrders.find(flightOrder => flightOrder.crew_member_id == crewMemberID);
    if (flightOrderToDelete.id > 0) {
      // Represents a flight order previously saved to the database.
      this.deleteFlightOrder(flightOrderToDelete.id);
    } else {
      this.flightOrders = this.flightOrders.filter(flightOrder => flightOrder.crew_member_id != crewMemberID);
      this.flightOrdersChange.next(this.flightOrders);
    }

  }

  getFlightOrders(date?: Date, shiftTemplateInstanceID?: number): Observable<FlightOrdersModel[]> {
    if (!this.flightOrders || (date != this._dateFilter) || (shiftTemplateInstanceID != this._shiftTemplateInstanceID)) {
      // Retrieve information from API.
      this.getFlightOrdersFromAPI(date, shiftTemplateInstanceID).subscribe(data => {
        this._dateFilter = date;
        this._shiftTemplateInstanceID = shiftTemplateInstanceID;
        this.flightOrders = data;
        this.flightOrdersChange.next(this.flightOrders);
        //this.addQualificationsToFlightOrders(this.flightOrders);
      });
    } else {
      // Information has already been retrieved previously.
      return of(this.flightOrders);
    }
    
  }

  getCurrentFlightOrders(): FlightOrdersModel[] {
    return this.flightOrders;
  }

  private getFlightOrdersFromAPI(date?: Date, shiftTemplateInstanceID?: number): Observable<FlightOrdersModel[]> {
    let params = new HttpParams();

    if (date) {
      params = params.append('date', this.datePipe.transform(date, 'yyyy-MM-dd', 'UTC'));
    }

    if (shiftTemplateInstanceID) {
      params = params.append('shift_template_instance_id', shiftTemplateInstanceID.toString());
    }

    return this.apiManager.getDataFromAPIServer(`/api/flight-orders`, params);
  }

  getFlightOrderByID(id: string): Observable<FlightOrdersModel[]> {
    return this.apiManager.getDataFromAPIServer(`/api/flight-orders/${id}`);
  }

  addFlightOrder(newID: number, newCrewMemberID: number, newDate: Date, newShiftTemplateInstanceID: number, newTotalHoursScheduled: number) {
    let newFlightOrder: FlightOrdersModel = { 
      id: newID, 
      crew_member_id: newCrewMemberID,
      date: newDate, 
      shift_template_instance_id: newShiftTemplateInstanceID,
      total_hours_scheduled: newTotalHoursScheduled,
    }; 

    this.addFlightOrderToAPI(newFlightOrder).subscribe(data => {
      this.flightOrders.push(data);
      this.flightOrdersChange.next(this.flightOrders);
    });
  }

  private addFlightOrderToAPI(flightOrder: FlightOrdersModel): Observable<FlightOrdersModel> {
    return this.apiManager.postDataToAPIServer(`/api/flight-orders`, flightOrder);
  }

  addFlightOrders(newFlightOrders: FlightOrdersModel[]): Observable<FlightOrdersModel[]> {
    return this.apiManager.postDataToAPIServer(`/api/flight-orders`, JSON.stringify(newFlightOrders));
  }

  batchUpdateFlightOrders(uuid: string, date: Date, squadron: string, shift: string) {

    let flightOrdersToUpdate = [];
    this.flightOrders.forEach(flightOrder => {
      // If the flight order is generated from the app, the Date object is recognized and maintained.
      // If pulled from the API, the date remains a string type, even though it's in a FlightOrderModel (bug???).
      let convertedDate;
      if (typeof flightOrder.date !== 'string') {
        convertedDate = flightOrder.date.toISOString().slice(0, 19).replace('T', ' ');
      } else {
        convertedDate = flightOrder.date;
      }

      let flightOrderToUpdate = {
        id: flightOrder.id,
        crew_member_id: flightOrder.crew_member_id, 
        date: convertedDate,
        shift_template_instance_id: flightOrder.shift_template_instance_id,
        total_hours_scheduled: flightOrder.total_hours_scheduled,
      }
      flightOrdersToUpdate.push(flightOrderToUpdate);
    });

    this.batchUpdateFlightOrdersToAPI(uuid, date, squadron, shift, flightOrdersToUpdate).subscribe(data => {
      let updatedFlightOrders: FlightOrdersModel[] = data;
      this.flightOrders.forEach(flightOrder => {
        // Set the 'id' for each flight order to enable further updates without additional records being created in database.
        flightOrder.id = updatedFlightOrders.find(updatedFlightOrder => updatedFlightOrder.crew_member_id == flightOrder.crew_member_id)?.id;
      });

      this.flightOrdersChange.next(this.flightOrders);

    });
  }

  private batchUpdateFlightOrdersToAPI(uuid: string, date: Date, squadron: string, shift: string, updateOrCreateFlightOrders: FlightOrdersModel[]): Observable<FlightOrdersModel[]> {
    // The batch update is used as part of the publish feature.  Include additional "meta" data to facilitate easier broadcasting on backend.
    let content = {
      _uuid: uuid,
      _date: date,
      _squadron: squadron,
      _shift: shift,
      data: updateOrCreateFlightOrders,
    }

    return this.apiManager.postDataToAPIServer(`/api/flight-orders/batch-update`, JSON.stringify(content));
  }

  updateFlightOrder(currentID: number, newOrCurrentCrewMemberID: number, newOrCurrentDate: Date, newOrCurrentShiftTemplateInstanceID: number, newOrCurrentTotalHoursScheduled) {
    // Makes no assumptions about which of the values in the record are being changed.  
    let updatedFlightOrder: FlightOrdersModel = {
      id: currentID, 
      crew_member_id: newOrCurrentCrewMemberID,
      date: newOrCurrentDate, 
      shift_template_instance_id: newOrCurrentShiftTemplateInstanceID,
      total_hours_scheduled: newOrCurrentTotalHoursScheduled,
    };

    let currentFlightOrderOnRecord: FlightOrdersModel = this.flightOrders.find(element => element.id == updatedFlightOrder.id);
    this.updateFlightOrderToAPI(updatedFlightOrder).subscribe(data => {
      updatedFlightOrder = data;
      currentFlightOrderOnRecord.crew_member_id = updatedFlightOrder.crew_member_id;
      currentFlightOrderOnRecord.date = updatedFlightOrder.date;
      currentFlightOrderOnRecord.shift_template_instance_id = updatedFlightOrder.shift_template_instance_id;

      this.flightOrdersChange.next(this.flightOrders);
    });
  }

  private updateFlightOrderToAPI(updatedFlightOrder: FlightOrdersModel): Observable<FlightOrdersModel> {
    return this.apiManager.putDataToAPIServer(`/api/flight-orders/${updatedFlightOrder.id}`, updatedFlightOrder);
  }

  batchDeleteFlightOrders(): Observable<FlightOrdersModel[]> {
    if (this.flightOrders.length > 0) {
      // Delete flight orders with known IDs.
      let flightOrderIDs: number[] = [];
      this.flightOrders.forEach(flightOrder => {
        if (flightOrder.id) {
          flightOrderIDs.push(flightOrder.id);
        }
      });

      this.flightOrders = [];
      this.flightOrdersChange.next(this.flightOrders);
      return this.apiManager.deleteDataFromAPIServer(`/api/flight-orders/batch-delete`, flightOrderIDs);

    } else {
      of({});

    }
  }

  deleteFlightOrder(id: number) {
    this.deleteFlightOrderFromAPI(id).subscribe(data => {
      this.flightOrders = this.flightOrders.filter(flightOrder => flightOrder.id != id);
      this.flightOrdersChange.next(this.flightOrders);
    });
  }

  private deleteFlightOrderFromAPI(id: number): Observable<FlightOrdersModel[]> {
    return this.apiManager.deleteDataFromAPIServer(`/api/flight-orders/${id}`);
  }
}
