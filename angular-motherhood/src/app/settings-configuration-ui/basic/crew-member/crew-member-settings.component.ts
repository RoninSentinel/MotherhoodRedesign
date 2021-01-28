import { Component, OnInit, AfterViewInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { CrewMemberService } from '../../../services/crew-member.service';
import { FlightService } from '../../../services/flight.service';
import { CrewMemberTypeService } from '../../../services/crew-member-type.service';
import { invalidUpdateIDValidator } from '../../../validators/invalid-update-id.validator';
import { CrewMemberModel, FlightModel, CrewMemberTypeModel } from 'src/app/model-types';
import { AlertService } from 'src/app/shared/components/alert-notifications';
import { UpperCasePipe } from '@angular/common';


@Component({
  selector: 'crew-member-settings',
  templateUrl: 'crew-member-settings.component.html',
  styleUrls: ['./crew-member-settings.component.css'],
})
export class CrewMemberSettingsComponent implements OnInit, AfterViewInit, OnChanges {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    @Input() accessLevel: string;
    editingPermissionsEnabled: boolean = false;

    crewMembers: CrewMemberModel[];
    currentSquadron: string;
    flights: FlightModel[];
    flightNamesAvailableForSelection = [];
    crewMemberTypes: CrewMemberTypeModel[];
    crewMemberTypesAvailableForSelection = [];
    isLoading = true;
    crewMemberSettingsForm = this.formBuilder.group({
        crewMemberID: [''],
        crewMemberRank: [''],
        crewMemberLastName: [''],
        crewMemberFirstName: [''],
        crewMemberMiddleInitial: [''],
        crewMemberCallSign: [''],
        crewMemberCrewMemberTypeID: [''],
        crewMemberSquadronID: [''],
        crewMemberFlightName: [''],

    });

    displayedColumns: string[] = ['select', 'id', 'rank', 'last_name', 'first_name', 'middle_initial', 'call_sign', 'squadron_id', 'crew_member_type_id', 'flight_name', 'team_name'];  // Possible to refactor so Component doesn't need to know column names?
    dataSource: MatTableDataSource<CrewMemberModel>;
    selection = new SelectionModel<CrewMemberModel>(true, []);

    constructor(
      private route: ActivatedRoute,
      private formBuilder: FormBuilder,
      private upperCasePipe: UpperCasePipe,
      protected alertService: AlertService,
      public crewMemberService: CrewMemberService,
      public flightService: FlightService,
      public crewMemberTypeService: CrewMemberTypeService,
    ){}

    ngOnInit(): void {
      this.currentSquadron = this.route.snapshot.paramMap.get('squadron');
      this.crewMemberSettingsForm.patchValue({crewMemberSquadronID: this.currentSquadron});

      this.isLoading = true;
      this.crewMemberService.getCrewMembers(this.currentSquadron).subscribe(data => {
        this.crewMembers = data;
        this.crewMemberSettingsForm.get('crewMemberID').setValidators([invalidUpdateIDValidator(this.crewMembers)]);

        // There is a chance that the form will attempt to set the paginator and sort sooner than it gets the data,
        // so auto-reset the form when data is received.
        this.dataSource = new MatTableDataSource<CrewMemberModel>(this.crewMembers);
        this.resetCrewMemberForm();

        this.isLoading = false;
      });

      this.flightService.getFlights(this.currentSquadron).subscribe(data => {
        // Create a list of unique flight names for selection (more readable than having them choose Flight ID).
        this.flights = data;
        let permittedFlightNames = this.flights.map(value => value.name);
        this.flightNamesAvailableForSelection = permittedFlightNames.filter((value, index, array) => array.indexOf(value) == index);
      })

      this.crewMemberTypeService.getCrewMemberTypes().subscribe(data => {
        this.crewMemberTypes = data;
        this.crewMemberTypesAvailableForSelection = this.crewMemberTypes.map(value => value.name);
      })
      
    }

    ngAfterViewInit() {
      // There is a chance the form begins to set values before the data from the backend is received.
      if (this.dataSource) {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes.accessLevel && changes.accessLevel.currentValue) {
        // Any access level (basic, advanced) should be able to edit squadron level data.
        this.editingPermissionsEnabled = true;
      }
  
    }
    
    onSubmit() {
      // Ignore whatever ID was passed into the form for adding a new record - let the DB create it.  Pass fake placeholder.
      const newCrewMemberID = -1;
      const newCrewMemberRank = this.crewMemberSettingsForm.value.crewMemberRank;
      const newCrewMemberLastName = this.crewMemberSettingsForm.value.crewMemberLastName;
      const newCrewMemberFirstName = this.crewMemberSettingsForm.value.crewMemberFirstName;
      const newCrewMemberMiddleInitial = this.crewMemberSettingsForm.value.crewMemberMiddleInitial;
      const newCrewMemberCallSign = this.crewMemberSettingsForm.value.crewMemberCallSign;
      const newCrewMemberCrewMemberType = this.crewMemberSettingsForm.value.crewMemberCrewMemberTypeID;
      const newCrewMemberSquadronID = this.crewMemberSettingsForm.value.crewMemberSquadronID;
      const newCrewMemberFlightName = this.crewMemberSettingsForm.value.crewMemberFlightName;
      const newCrewMemberFlightID = this.convertFlightNameToID(newCrewMemberFlightName);

      this.crewMemberService.addCrewMember(newCrewMemberID, newCrewMemberRank, newCrewMemberLastName, newCrewMemberFirstName, newCrewMemberMiddleInitial, newCrewMemberCallSign, newCrewMemberCrewMemberType, newCrewMemberSquadronID, newCrewMemberFlightID).subscribe(data => {
        let crewMemberAdded: CrewMemberModel = data;
        //crewMemberAdded.flight.name = newCrewMemberFlightName;
        this.crewMembers.push(crewMemberAdded);

        this.resetCrewMemberForm();
      })
    }

    onUpdate() {
      const currentCrewMemberID = this.crewMemberSettingsForm.value.crewMemberID;
      const updatedCrewMemberRank = this.crewMemberSettingsForm.value.crewMemberRank;
      const updatedCrewMemberLastName = this.crewMemberSettingsForm.value.crewMemberLastName;
      const updatedCrewMemberFirstName = this.crewMemberSettingsForm.value.crewMemberFirstName;
      const updatedCrewMemberMiddleInitial = this.crewMemberSettingsForm.value.crewMemberMiddleInitial;
      const updatedCrewMemberCallSign = this.crewMemberSettingsForm.value.crewMemberCallSign;
      const updatedCrewMemberCrewMemberType = this.crewMemberSettingsForm.value.crewMemberCrewMemberTypeID;
      const updatedCrewMemberSquadronID = this.crewMemberSettingsForm.value.crewMemberSquadronID;
      const updatedCrewMemberFlightName = this.crewMemberSettingsForm.value.crewMemberFlightName
      const updatedCrewMemberFlightID = this.convertFlightNameToID(updatedCrewMemberFlightName);

      let currentCrewMemberOnRecord: CrewMemberModel = this.crewMembers.find(element => element.id == currentCrewMemberID);
      if (currentCrewMemberOnRecord) {
        this.crewMemberService.updateCrewMember(currentCrewMemberID, updatedCrewMemberRank, updatedCrewMemberLastName, updatedCrewMemberFirstName, updatedCrewMemberMiddleInitial, updatedCrewMemberCallSign, updatedCrewMemberCrewMemberType, updatedCrewMemberSquadronID, updatedCrewMemberFlightID).subscribe(data => {
          let updatedCrewMember: CrewMemberModel = data[0];
          // Assumes values used are valid, if successfully updated database and passed form validation.
          currentCrewMemberOnRecord.rank = updatedCrewMemberRank;
          currentCrewMemberOnRecord.last_name = updatedCrewMemberLastName;
          currentCrewMemberOnRecord.first_name = updatedCrewMemberFirstName;
          currentCrewMemberOnRecord.middle_initial = updatedCrewMemberMiddleInitial;
          currentCrewMemberOnRecord.call_sign = updatedCrewMemberCallSign;
          currentCrewMemberOnRecord.crew_member_type_id = updatedCrewMemberCrewMemberType;
          currentCrewMemberOnRecord.squadron_id = updatedCrewMemberSquadronID;
          currentCrewMemberOnRecord.flight_id = updatedCrewMemberFlightID;

          currentCrewMemberOnRecord.flight = updatedCrewMember.flight;

          this.resetCrewMemberForm();
        })

      } else {
        this.alertService.error("Error: Record not found to update.");
      }
    
    }

    onDelete() {
      // Only the rows that have been selected will be deleted, based on id.
      const crewMembersToDelete = this.selection.selected.values();
      for (let deleteType of crewMembersToDelete) {
        this.crewMemberService.deleteCrewMember(deleteType.id).subscribe(data => {
          // Rather than hit the DB for a list of remaining records, simply filter out the id known to be deleted after success.
          this.crewMembers = this.crewMembers.filter(crewMember => crewMember.id != deleteType.id);
          this.resetCrewMemberForm();
        })
      }
      this.selection.clear();
    }

    get crewMemberID() {
      return this.crewMemberSettingsForm.get('crewMemberID');
    }

    get crewMemberRank() {
      return this.crewMemberSettingsForm.get('crewMemberRank');
    }

    get crewMemberLastName() {
      return this.crewMemberSettingsForm.get('crewMemberLastName');
    }

    get crewMemberFirstName() {
      return this.crewMemberSettingsForm.get('crewMemberFirstName');
    }

    get crewMemberMiddleInitial() {
      return this.crewMemberSettingsForm.get('crewMemberMiddleInitial');
    }

    get crewMemberCallSign() {
      return this.crewMemberSettingsForm.get('crewMemberCallSign');
    }

    get crewMemberCrewMemberTypeID() {
      return this.crewMemberSettingsForm.get('crewMemberCrewMemberTypeID');
    }

    get crewMemberSquadronID() {
      return this.crewMemberSettingsForm.get('crewMemberSquadronID');
    }

    get crewMemberFlightName() {
      return this.crewMemberSettingsForm.get('crewMemberFlightName');
    }

    convertFlightNameToID(flightName: string): number {
      // Find the first flight record with a name that matches the search name, and return the ID equivalent.
      let flightID = this.flights.find(element => element.name == flightName)?.id;
      return flightID;

    }

    updateCrewMemberFormAfterIDSelected() {
      // Fill out the form for update after a known primary key is entered, allowing for quicker editing by user.
      let crewMemberIDForUpdate = this.crewMemberSettingsForm.value.crewMemberID;
      if (crewMemberIDForUpdate) {
        let crewMember = this.crewMembers.find(element => element.id == crewMemberIDForUpdate);
        if (crewMember) {
          // Only make changes if the key matches a record.
          this.crewMemberSettingsForm.patchValue({
            crewMemberRank: crewMember.rank,
            crewMemberLastName: crewMember.last_name,
            crewMemberFirstName: crewMember.first_name,
            crewMemberMiddleInitial: crewMember.middle_initial,
            crewMemberCallSign: crewMember.call_sign,
            crewMemberCrewMemberTypeID: crewMember.crew_member_type_id,
            crewMemberSquadronID: this.upperCasePipe.transform(crewMember.squadron_id),
            crewMemberFlightName: crewMember.flight?.name,
          });
        }
      }
    }

    autoFillFormAfterRowSelection(row_selected: boolean) {
      if (row_selected) {
        if (this.selection.selected.length == 1) {
          const crewMembersToAutoFill = this.selection.selected.values();
          for (let crewMember of crewMembersToAutoFill) {
            // Should only be one crew member.
            this.crewMemberSettingsForm.patchValue({
              crewMemberID: crewMember.id,
            });
            this.updateCrewMemberFormAfterIDSelected();
          }
        }
      }
    }

    resetCrewMemberForm() {
      this.dataSource = new MatTableDataSource<CrewMemberModel>(this.crewMembers);
      this.crewMemberSettingsForm.reset();
      this.crewMemberSettingsForm.patchValue({crewMemberSquadronID: this.upperCasePipe.transform(this.currentSquadron)});

      // Must reset the validators, to prevent false positives after change to crew member data.
      this.crewMemberSettingsForm.get('crewMemberID').setValidators([invalidUpdateIDValidator(this.crewMembers)]);

      this.dataSource.data = this.dataSource.data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.selection.clear();
    }

    /** https://material.angular.io/components/table/examples */

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
      // There is a chance the form begins to set values before the data from the backend is received.
      if (! this.dataSource) {
        return false;
      }

      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
      this.isAllSelected() ?
          this.selection.clear() :
          this.dataSource.data.forEach(row => this.selection.select(row));
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: CrewMemberModel): string {
      if (!row) {
        return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }

}