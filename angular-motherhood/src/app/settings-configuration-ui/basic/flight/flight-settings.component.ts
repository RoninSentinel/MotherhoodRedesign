import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Validators, FormBuilder} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';

import { FlightService } from '../../../services/flight.service';
import { TeamService } from 'src/app/services/team.service';
import { forbiddenNameValidator } from '../../../validators/forbidden-name.validator';
import { invalidUpdateIDValidator } from '../../../validators/invalid-update-id.validator';
import { FlightModel, TeamModel } from 'src/app/model-types';
import { AlertService } from 'src/app/shared/components/alert-notifications';
import { UpperCasePipe } from '@angular/common';


@Component({
  selector: 'flight-settings',
  templateUrl: 'flight-settings.component.html',
  styleUrls: ['./flight-settings.component.css'],
})
export class FlightSettingsComponent implements OnInit, OnChanges {

  @Input() accessLevel: string;
  editingPermissionsEnabled: boolean = false;

  flights: FlightModel[];
  currentSquadron: string;
  teams: TeamModel[];
  teamNamesAvailableForSelection = [];
  isLoading = true;
  flightSettingsForm = this.formBuilder.group({
      flightID: [''],
      flightName: [''],
      flightSquadronID: [''],
      flightTeamName: [''],
  });

  displayedColumns: string[] = ['select', 'id', 'name', 'squadron_id', 'team_name'];  // Possible to refactor so Component doesn't need to know column names?
  dataSource: MatTableDataSource<FlightModel>;
  selection = new SelectionModel<FlightModel>(true, []);

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private upperCasePipe: UpperCasePipe,
    protected alertService: AlertService,
    public flightService: FlightService,
    public teamService: TeamService,
  ){}

  ngOnInit(): void {
    this.currentSquadron = this.route.snapshot.paramMap.get('squadron');
    this.flightSettingsForm.patchValue({flightSquadronID: this.currentSquadron});
    this.isLoading = true;
    this.flightService.getFlights(this.currentSquadron).subscribe(data => {
      this.flights = data;
      this.flightSettingsForm.get('flightName').setValidators([Validators.required, forbiddenNameValidator(this.flights)]);
      this.flightSettingsForm.get('flightID').setValidators([invalidUpdateIDValidator(this.flights)]);
      this.resetFlightForm();
      this.isLoading = false;
    });

    this.teamService.getTeams(this.currentSquadron).subscribe(data => {
      this.teams = data;
      let permittedTeamNames = this.teams.map(value => value.name);
      this.teamNamesAvailableForSelection = permittedTeamNames.filter((value, index, array) => array.indexOf(value) == index);
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.accessLevel && changes.accessLevel.currentValue) {
      // Any access level (basic, advanced) should be able to edit squadron level data.
      this.editingPermissionsEnabled = true;
    }

  }
  
  onSubmit() {
    // Ignore whatever ID was passed into the form for adding a new record - let the DB create it.  Pass fake placeholder.
    const newFlightID = -1;
    const newFlightName = this.flightSettingsForm.value.flightName;
    const newFlightTeamName = this.flightSettingsForm.value.flightTeamName;
    const newFlightTeamID = this.convertTeamNameToID(newFlightTeamName);
    const newFlightSquadronID = this.flightSettingsForm.value.flightSquadronID;

    this.flightService.addFlight(newFlightID, newFlightName, newFlightTeamID, newFlightSquadronID).subscribe(data => {
      // API currently doesn't return the team name after POST, due to it being stored in a separate table.
      let flightAdded: FlightModel = data;
      flightAdded.team = new TeamModel(0, newFlightTeamName, this.currentSquadron);

      this.flights.push(flightAdded);
      this.resetFlightForm();
    })
  }

  onUpdate() {
    const currentFlightID = this.flightSettingsForm.value.flightID;
    const updatedFlightName = this.flightSettingsForm.value.flightName;
    const updatedFlightTeamName = this.flightSettingsForm.value.flightTeamName;
    const updatedFlightTeamID = this.convertTeamNameToID(updatedFlightTeamName);
    const updatedFlightSquadronID = this.flightSettingsForm.value.flightSquadronID;

    let currentFlightOnRecord: FlightModel = this.flights.find(flight => flight.id == currentFlightID);
    
    if (currentFlightOnRecord) {
      let currentFlightName = currentFlightOnRecord.name;
      currentFlightOnRecord.name = updatedFlightName;

      let duplicateNames: FlightModel[] = this.flights.filter(flight => flight.name == updatedFlightName);
  
      if (duplicateNames.length > 1) {
        currentFlightOnRecord.name = currentFlightName;  // Set back to previous value.
        this.alertService.error("Error: A record with that flight name already exists.  Update aborted.");
        return;
      }

      this.flightService.updateFlight(currentFlightID, updatedFlightName, updatedFlightTeamID, updatedFlightSquadronID).subscribe(data => {
        // Assumes values used are valid, if successfully updated database and passed form validation.
        currentFlightOnRecord.name = updatedFlightName;
        currentFlightOnRecord.team_id = updatedFlightTeamID;
        currentFlightOnRecord.team.name = updatedFlightTeamName;
        currentFlightOnRecord.squadron_id = updatedFlightSquadronID;

        this.resetFlightForm();
      })

    } else {
      this.alertService.error("Error: Record not found to update.");
    }
  }

  onDelete() {
    // Only the rows that have been selected will be deleted, based on id.
    const flightsToDelete = this.selection.selected.values();
    for (let deleteType of flightsToDelete) {
      this.flightService.deleteFlight(deleteType.id.toString()).subscribe(data => {
        // Rather than hit the DB for a list of remaining records, simply filter out the id known to be deleted after success.
        this.flights = this.flights.filter(flight => flight.id != deleteType.id);
        this.resetFlightForm();
      })
    }
    this.selection.clear();
  }

  get flightID() {
    return this.flightSettingsForm.get('flightID');
  }

  get flightName() {
    return this.flightSettingsForm.get('flightName');
  }

  get flightSquadronID() {
    return this.flightSettingsForm.get('flightSquadronID');
  }

  get flightTeamName() {
    return this.flightSettingsForm.get('flightTeamName');
  }

  convertTeamNameToID(teamName: string): number {
    // Find the first team record with a name that matches the search name, and return the ID equivalent.
    let teamID = this.teams.find(element => element.name == teamName)?.id;
    return teamID;

  }

  updateFlightFormAfterIDSelected() {
    // Fill out the form for update after a known primary key is entered, allowing for quicker editing by user.
    let flightIDForUpdate = this.flightSettingsForm.value.flightID;
    if (flightIDForUpdate) {
      let flight = this.flights.find(element => element.id == flightIDForUpdate);
      if (flight) {
        // Only make changes if the key matches a record.
        this.flightSettingsForm.patchValue({
          flightName: flight.name,
          flightSquadronID: this.upperCasePipe.transform(flight.squadron_id),
          flightTeamName: flight.team.name,
        });
      }
    }
  }

  autoFillFormAfterRowSelection(row_selected: boolean) {
    if (row_selected) {
      if (this.selection.selected.length == 1) {
        const flightsToAutoFill = this.selection.selected.values();
        for (let flight of flightsToAutoFill) {
          // Should only be one flight.
          this.flightSettingsForm.patchValue({
            flightID: flight.id,
          });
          this.updateFlightFormAfterIDSelected();
        }
      }
    }
  }

  resetFlightForm() {
    this.dataSource = new MatTableDataSource<FlightModel>(this.flights);
    this.flightSettingsForm.reset();
    this.flightSettingsForm.patchValue({flightSquadronID: this.upperCasePipe.transform(this.currentSquadron)});

    // Must reset the validators, to prevent false positives after change to flight data.
    this.flightSettingsForm.get('flightName').setValidators([Validators.required, forbiddenNameValidator(this.flights)]);
    this.flightSettingsForm.get('flightID').setValidators([invalidUpdateIDValidator(this.flights)])

    this.selection.clear();
  }

  /** https://material.angular.io/components/table/examples */
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
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
  checkboxLabel(row?: FlightModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

}