import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Validators, FormBuilder} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import { DatePipe, UpperCasePipe } from '@angular/common';

import { ShiftTemplateService } from '../../../services/shift-template.service';
import { forbiddenNameValidator } from '../../../validators/forbidden-name.validator';
import { invalidUpdateIDValidator } from '../../../validators/invalid-update-id.validator';
import { ShiftTemplateModel } from 'src/app/model-types';
import { totalHoursCalc } from '../../../helpers/total-hours-calc.helper';
import { AlertService } from 'src/app/shared/components/alert-notifications';


@Component({
  selector: 'shift-template-settings',
  templateUrl: 'shift-template-settings.component.html',
  styleUrls: ['./shift-template-settings.component.css'],
})
export class ShiftTemplateSettingsComponent implements OnInit, OnChanges {

  @Input() accessLevel: string;
  editingPermissionsEnabled: boolean = false;

  shiftTemplates: ShiftTemplateModel[];
  currentSquadron: string;
  isLoading = true;
  shiftTemplateSettingsForm = this.formBuilder.group({
      shiftTemplateID: [''],
      shiftTemplateName: [''],
      shiftTemplateStartTime: [''],
      shiftTemplateEndTime: [''],
      shiftTemplateTotalHours: [''],
      shiftTemplateIsActive: [''],
      shiftTemplateSquadronID: [''],

  });

  displayedColumns: string[] = ['select', 'id', 'name', 'start_time', 'end_time', 'total_hours', 'is_active', 'squadron_id'];  // Possible to refactor so Component doesn't need to know column names?
  dataSource: MatTableDataSource<ShiftTemplateModel>;
  selection = new SelectionModel<ShiftTemplateModel>(true, []);

  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private upperCasePipe: UpperCasePipe,
    protected alertService: AlertService,
    public shiftTemplateService: ShiftTemplateService,
  ){}

  ngOnInit(): void {
    this.currentSquadron = this.route.snapshot.paramMap.get('squadron');
    this.shiftTemplateSettingsForm.patchValue({shiftTemplateSquadronID: this.currentSquadron});
    this.isLoading = true;
    this.shiftTemplateService.getShiftTemplates(this.currentSquadron).subscribe(data => {
      this.shiftTemplates = data;
      this.shiftTemplateSettingsForm.get('shiftTemplateID').setValidators([invalidUpdateIDValidator(this.shiftTemplates)]);
      this.resetShiftTemplateForm();
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
    const newShiftTemplateID = -1;
    const newShiftTemplateName = this.shiftTemplateSettingsForm.value.shiftTemplateName;
    const newShiftTemplateStartTime = this.shiftTemplateSettingsForm.value.shiftTemplateStartTime;
    const newShiftTemplateEndTime = this.shiftTemplateSettingsForm.value.shiftTemplateEndTime;
    const newShiftTemplateTotalHours = this.shiftTemplateSettingsForm.value.shiftTemplateTotalHours;
    const newShiftTemplateIsActive = this.shiftTemplateSettingsForm.value.shiftTemplateIsActive;
    const newShiftTemplateSquadronID = this.shiftTemplateSettingsForm.value.shiftTemplateSquadronID;

    this.shiftTemplateService.addShiftTemplate(newShiftTemplateID, newShiftTemplateName, newShiftTemplateStartTime, newShiftTemplateEndTime, newShiftTemplateTotalHours, newShiftTemplateIsActive, newShiftTemplateSquadronID).subscribe(data => {
      this.shiftTemplates.push(data);
      this.resetShiftTemplateForm();
    })
  }

  onUpdate() {
    const currentShiftTemplateID = this.shiftTemplateSettingsForm.value.shiftTemplateID;
    const updatedShiftTemplateName = this.shiftTemplateSettingsForm.value.shiftTemplateName;
    const updatedShiftTemplateStartTime = this.shiftTemplateSettingsForm.value.shiftTemplateStartTime;
    const updatedShiftTemplateEndTime = this.shiftTemplateSettingsForm.value.shiftTemplateEndTime;
    const updatedShiftTemplateTotalHours = this.shiftTemplateSettingsForm.value.shiftTemplateTotalHours;
    const updatedShiftTemplateIsActive = this.shiftTemplateSettingsForm.value.shiftTemplateIsActive;
    const updatedShiftTemplateSquadronID = this.shiftTemplateSettingsForm.value.shiftTemplateSquadronID;

    let currentShiftTemplateOnRecord: ShiftTemplateModel = this.shiftTemplates.find(element => element.id == currentShiftTemplateID);
    if (currentShiftTemplateOnRecord) {
      this.shiftTemplateService.updateShiftTemplate(currentShiftTemplateID, updatedShiftTemplateName, updatedShiftTemplateStartTime, updatedShiftTemplateEndTime, updatedShiftTemplateTotalHours, updatedShiftTemplateIsActive, updatedShiftTemplateSquadronID).subscribe(data => {
        // Assumes values used are valid, if successfully updated database and passed form validation.
        
        // Create a generic date with correct minutes and seconds for temporary display purposes.
        let today= new Date();

        currentShiftTemplateOnRecord.name = updatedShiftTemplateName;
        currentShiftTemplateOnRecord.start_time = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), updatedShiftTemplateStartTime.slice(0, 2), updatedShiftTemplateStartTime.slice(-2), 0, 0));
        currentShiftTemplateOnRecord.end_time = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), updatedShiftTemplateEndTime.slice(0, 2), updatedShiftTemplateEndTime.slice(-2), 0, 0));
        currentShiftTemplateOnRecord.total_hours = updatedShiftTemplateTotalHours;
        currentShiftTemplateOnRecord.is_active = updatedShiftTemplateIsActive;
        currentShiftTemplateOnRecord.squadron_id = updatedShiftTemplateSquadronID;

        this.resetShiftTemplateForm();
      })

    } else {
      this.alertService.error("Error: Record not found to update.");

    }
  }

  onDelete() {
    // Only the rows that have been selected will be deleted, based on id.
    const shiftTemplatesToDelete = this.selection.selected.values();
    for (let deleteType of shiftTemplatesToDelete) {
      this.shiftTemplateService.deleteShiftTemplate(deleteType.id).subscribe(data => {
        // Rather than hit the DB for a list of remaining records, simply filter out the id known to be deleted after success.
        this.shiftTemplates = this.shiftTemplates.filter(shiftTemplate => shiftTemplate.id != deleteType.id);
        this.resetShiftTemplateForm();
      })
    }
    this.selection.clear();
  }

  get shiftTemplateID() {
    return this.shiftTemplateSettingsForm.get('shiftTemplateID');
  }

  get shiftTemplateName() {
    return this.shiftTemplateSettingsForm.get('shiftTemplateName');
  }

  get shiftTemplateStartTime() {
    return this.shiftTemplateSettingsForm.get('shiftTemplateStartTime');
  }

  get shiftTemplateEndTime() {
    return this.shiftTemplateSettingsForm.get('shiftTemplateEndTime');
  }

  get shiftTemplateTotalHours() {
    return this.shiftTemplateSettingsForm.get('shiftTemplateTotalHours');
  }

  get shiftTemplateIsActive() {
    return this.shiftTemplateSettingsForm.get('shiftTemplateIsActive');
  }

  get shiftTemplateSquadronID() {
    return this.shiftTemplateSettingsForm.get('shiftTemplateSquadronID');
  }

  updateShiftTemplateFormAfterIDSelected() {
    // Fill out the form for update after a known primary key is entered, allowing for quicker editing by user.
    let shiftTemplateIDForUpdate = this.shiftTemplateSettingsForm.value.shiftTemplateID;
    if (shiftTemplateIDForUpdate) {
      let shiftTemplate = this.shiftTemplates.find(element => element.id == shiftTemplateIDForUpdate);
      if (shiftTemplate) {
        // Only make changes if the key matches a record.
        this.shiftTemplateSettingsForm.patchValue({
          shiftTemplateName: shiftTemplate.name,
          shiftTemplateStartTime: this.datePipe.transform(shiftTemplate.start_time, 'HH:mm', 'UTC'),
          shiftTemplateEndTime: this.datePipe.transform(shiftTemplate.end_time, 'HH:mm', 'UTC'),
          shiftTemplateTotalHours: shiftTemplate.total_hours,
          shiftTemplateIsActive: shiftTemplate.is_active,
          shiftTemplateSquadronID: this.upperCasePipe.transform(shiftTemplate.squadron_id),
        });
      }
    }
  }

  autoFillFormAfterRowSelection(row_selected: boolean) {
    if (row_selected) {
      if (this.selection.selected.length == 1) {
        const shiftTemplatesToAutoFill = this.selection.selected.values();
        for (let shiftTemplate of shiftTemplatesToAutoFill) {
          // Should only be one shift template.
          this.shiftTemplateSettingsForm.patchValue({
            shiftTemplateID: shiftTemplate.id,
          });
          this.updateShiftTemplateFormAfterIDSelected();
        }
      }
    }
  }

  resetShiftTemplateForm() {
    this.dataSource = new MatTableDataSource<ShiftTemplateModel>(this.shiftTemplates);
    this.shiftTemplateSettingsForm.reset();
    this.shiftTemplateSettingsForm.patchValue({shiftTemplateSquadronID: this.upperCasePipe.transform(this.currentSquadron)});

    // Must reset the validators, to prevent false positives after change to flight data.
    this.shiftTemplateSettingsForm.get('shiftTemplateID').setValidators([invalidUpdateIDValidator(this.shiftTemplates)]);

    this.selection.clear();
  }

  autoFillTotalHours(startTime: string, endTime: string) {
    if (startTime && endTime) {
      let totalHours: number = totalHoursCalc(startTime, endTime);
      this.shiftTemplateSettingsForm.patchValue({shiftTemplateTotalHours: totalHours});
    } 
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
  checkboxLabel(row?: ShiftTemplateModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

}