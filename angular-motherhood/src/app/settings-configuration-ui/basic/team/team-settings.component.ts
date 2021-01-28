import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Validators, FormBuilder} from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';

import { TeamService } from '../../../services/team.service';
import { forbiddenNameValidator } from '../../../validators/forbidden-name.validator';
import { invalidUpdateIDValidator } from '../../../validators/invalid-update-id.validator';
import { TeamModel } from 'src/app/model-types';
import { AlertService } from 'src/app/shared/components/alert-notifications';
import { UpperCasePipe } from '@angular/common';


@Component({
  selector: 'team-settings',
  templateUrl: 'team-settings.component.html',
  styleUrls: ['./team-settings.component.css'],
})
export class TeamSettingsComponent implements OnInit, OnChanges {

  @Input() accessLevel: string;
  editingPermissionsEnabled: boolean = false;

  teams: TeamModel[];
  currentSquadron: string;
  isLoading = true;
  teamSettingsForm = this.formBuilder.group({
      teamID: [''],
      teamName: [''],
      teamSquadronID: [''],

  });

  displayedColumns: string[] = ['select', 'id', 'name', 'squadron_id'];  // Possible to refactor so Component doesn't need to know column names?
  dataSource: MatTableDataSource<TeamModel>;
  selection = new SelectionModel<TeamModel>(true, []);

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private upperCasePipe: UpperCasePipe,
    protected alertService: AlertService,
    public teamService: TeamService,
  ){}

  ngOnInit(): void {
    this.currentSquadron = this.route.snapshot.paramMap.get('squadron');
    this.teamSettingsForm.patchValue({teamSquadronID: this.currentSquadron});

    this.isLoading = true;
    this.teamService.getTeams(this.currentSquadron).subscribe(data => {
      this.teams = data;
      this.teamSettingsForm.get('teamName').setValidators([Validators.required, forbiddenNameValidator(this.teams)]);
      this.teamSettingsForm.get('teamID').setValidators([invalidUpdateIDValidator(this.teams)]);
      this.resetTeamForm();
      this.isLoading = false;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.accessLevel && changes.accessLevel.currentValue) {
      // Any access level (basic, advanced) should be able to edit squadron level data.
      this.editingPermissionsEnabled = true;
    }

  }
  
  onSubmit() {
      // Ignore whatever ID was passed into the form for adding a new record - let the DB create it.  Pass fake placeholder.
      const newTeamID = -1;
      const newTeamName = this.teamSettingsForm.value.teamName;
      const newTeamSquadronID = this.teamSettingsForm.value.teamSquadronID;

      this.teamService.addTeam(newTeamID, newTeamName, newTeamSquadronID).subscribe(data => {
        this.teams.push(data);
        this.resetTeamForm();
      })
  }

  onUpdate() {
    const currentTeamID = this.teamSettingsForm.value.teamID;
    const updatedTeamName = this.teamSettingsForm.value.teamName;
    const updatedTeamSquadronID = this.teamSettingsForm.value.teamSquadronID;

    let currentTeamOnRecord: TeamModel = this.teams.find(team => team.id == currentTeamID);

    if (currentTeamOnRecord) {
      let currentTeamName = currentTeamOnRecord.name;
      currentTeamOnRecord.name = updatedTeamName;

      let duplicateNames: TeamModel[] = this.teams.filter(team=> team.name == updatedTeamName);
  
      if (duplicateNames.length > 1) {
        currentTeamOnRecord.name = currentTeamName;  // Set back to previous value.
        this.alertService.error("Error: A record with that team name already exists.  Update aborted.");
        return;
      }

      this.teamService.updateTeam(currentTeamID, updatedTeamName, updatedTeamSquadronID).subscribe(data => {
        // Assumes values used are valid, if successfully updated database and passed form validation.
        currentTeamOnRecord.name = updatedTeamName;
        currentTeamOnRecord.squadron_id = updatedTeamSquadronID;

        this.resetTeamForm();
      })

    } else {
      this.alertService.error("Error: Record not found to update.");
    }
  }

  onDelete() {
    // Only the rows that have been selected will be deleted, based on id.
    const teamsToDelete = this.selection.selected.values();
    for (let deleteType of teamsToDelete) {
      this.teamService.deleteTeam(deleteType.id).subscribe(data => {
        // Rather than hit the DB for a list of remaining records, simply filter out the id known to be deleted after success.
        this.teams = this.teams.filter(team => team.id != deleteType.id);
        this.resetTeamForm();
      })
    }
    this.selection.clear();
  }

  get teamID() {
    return this.teamSettingsForm.get('teamID');
  }

  get teamName() {
    return this.teamSettingsForm.get('teamName');
  }

  get teamSquadronID() {
    return this.teamSettingsForm.get('teamSquadronID');
  }

  updateTeamFormAfterIDSelected() {
    // Fill out the form for update after a known primary key is entered, allowing for quicker editing by user.
    let teamIDForUpdate = this.teamSettingsForm.value.teamID;
    if (teamIDForUpdate) {
      let team = this.teams.find(element => element.id == teamIDForUpdate);
      if (team) {
        // Only make changes if the key matches a record.
        this.teamSettingsForm.patchValue({
          teamName: team.name,
          teamSquadronID: this.upperCasePipe.transform(team.squadron_id),
        });
      }
    }
  }

  autoFillFormAfterRowSelection(row_selected: boolean) {
    if (row_selected) {
      if (this.selection.selected.length == 1) {
        const teamsToAutoFill = this.selection.selected.values();
        for (let team of teamsToAutoFill) {
          // Should only be one team.
          this.teamSettingsForm.patchValue({
            teamID: team.id,
          });
          this.updateTeamFormAfterIDSelected();
        }
      }
    }
  }

  resetTeamForm() {
    this.dataSource = new MatTableDataSource<TeamModel>(this.teams);
    this.teamSettingsForm.reset();
    this.teamSettingsForm.patchValue({teamSquadronID: this.upperCasePipe.transform(this.currentSquadron)});

    // Must reset the validators, to prevent false positives after change to crew member data.
    this.teamSettingsForm.get('teamName').setValidators([Validators.required, forbiddenNameValidator(this.teams)]);
    this.teamSettingsForm.get('teamID').setValidators([invalidUpdateIDValidator(this.teams)]);

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
  checkboxLabel(row?: TeamModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

}