import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges, AfterViewInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { CrewMemberModel, CrewMemberShiftLineTimeBlocksModel, CrewMemberTypeModel, FlightOrdersModel, MotherhoodShiftScheduleModel } from 'src/app/model-types';
import { CrewMemberTypeService } from 'src/app/services/crew-member-type.service';
import { FlightOrderService } from 'src/app/services/flight-order.service';
import { MotherhoodSchedulerService } from 'src/app/services/motherhood-scheduler.service';

@Component({
  selector: 'motherhood-flight-orders',
  templateUrl: 'motherhood-flight-orders.component.html',
  styleUrls: ['./motherhood-flight-orders.component.css'],
})
export class MotherhoodFlightOrdersComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() crewMemberToAddToFlightOrders: CrewMemberModel;
  @Input() shiftDate: Date;
  @Input() editMode: boolean;

  @Output() flightOrdersUpdatedEvent = new EventEmitter<FlightOrdersModel[]>();
  @Output() flightOrderRowClickedEvent = new EventEmitter<FlightOrdersModel>();
  @Output() callSignPreferenceClickedEvent = new EventEmitter<boolean>();

  currentSquadron: string;
  crewMemberTypes: CrewMemberTypeModel[] = [];
  flightOrders: FlightOrdersModel[] = [];
  motherhoodShiftSchedule: MotherhoodShiftScheduleModel;
  callSignPreference: boolean = false;

  private _flightOrderSubscription;
  private _motherhoodShiftScheduleSubscription;
  
  displayedColumns: string[] = ['select', 'rank', 'last_name', 'call_sign', 'total_hours_scheduled', 'qualifications'];
  dataSources: MatTableDataSource<FlightOrdersModel>[] = [];

  constructor(
    public crewMemberTypeService: CrewMemberTypeService,
    public flightOrderService: FlightOrderService,
    public motherhoodSchedulerService: MotherhoodSchedulerService,
  ){}

  ngOnInit(): void {
      this.crewMemberTypeService.getCrewMemberTypes().subscribe(data => {
        this.crewMemberTypes = data;
        this.resetFlightOrderRosters();
      });

      this._motherhoodShiftScheduleSubscription = this.motherhoodSchedulerService.motherhoodShiftSchedule$.subscribe(data => {
        this.motherhoodShiftSchedule = data;
        this.calculateTotalHoursScheduled();
        this.resetFlightOrderRosters();
      });

      this._flightOrderSubscription = this.flightOrderService.flightOrders$.subscribe(data => {
        this.flightOrders = data;
        this.resetFlightOrderRosters();
      });

  }

  ngOnChanges(changes: SimpleChanges) {
      if (changes.crewMemberToAddToFlightOrders && changes.crewMemberToAddToFlightOrders.currentValue) {
        // Add name to the flight orders.
        this.addCrewMemberToFlightOrders();
      }

  }

  ngAfterViewInit() {
    // There is a chance the form begins to set values before the data from the backend is received.
    this.calculateTotalHoursScheduled();
    this.resetFlightOrderRosters();
  }

  ngOnDestroy() {
    this._motherhoodShiftScheduleSubscription.unsubscribe();
    this._flightOrderSubscription.unsubscribe();
  }

  addCrewMemberToFlightOrders() {
      if (this.crewMemberToAddToFlightOrders) {
        this.flightOrderService.addCrewMemberToFlightOrders(this.crewMemberToAddToFlightOrders);          
      }
  }

  removeCrewMemberFromFlightOrders(crewMemberID: number) {
    this.flightOrderService.removeCrewMemberFromFlightOrders(crewMemberID);
  }

  resetFlightOrderRosters() {
    // Resetting is required in order to re-configure the table data sources, sorting, etc.
    this.dataSources = [];
    this.crewMemberTypes?.forEach((crewMemberType, index) => {
      this.flightOrders = this.flightOrders.sort((a,b) => a.crew_member?.last_name.localeCompare(b.crew_member?.last_name));
      let filteredFlightOrders: FlightOrdersModel[] = this.flightOrders.filter(flightOrder => flightOrder.crew_member?.crew_member_type_id == crewMemberType.name);
      let newDataSource = new MatTableDataSource<FlightOrdersModel>(filteredFlightOrders);
      newDataSource.data = newDataSource.data;
      this.dataSources.push(newDataSource);
    });

    this.flightOrdersUpdatedEvent.emit(this.flightOrders);

  }

  calculateTotalHoursScheduled(conflictingTimeBlocks?: CrewMemberShiftLineTimeBlocksModel[]) {
    this.flightOrders = this.motherhoodSchedulerService.calculateTotalHoursScheduled(this.flightOrders, conflictingTimeBlocks);
  }

  flightOrderSelectedOnRowClick(row: FlightOrdersModel) {
    // this.flightOrderRowClickedEvent.emit(row);
  }

  callSignPreferenceClick() {
    this.callSignPreference = true;
    this.callSignPreferenceClickedEvent.emit(true);
  }

  lastNamePreferenceClick() {
    this.callSignPreference = false;
    this.callSignPreferenceClickedEvent.emit(false);
  }

}