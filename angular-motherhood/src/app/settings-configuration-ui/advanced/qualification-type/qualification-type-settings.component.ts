  import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Validators, FormBuilder} from '@angular/forms';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';

import { QualificationTypeService } from '../../../services/qualification-type.service';
import { CrewMemberTypeService } from '../../../services/crew-member-type.service';
import { forbiddenNameValidator } from '../../../validators/forbidden-name.validator';
import { invalidUpdateIDValidator } from '../../../validators/invalid-update-id.validator';
import { QualificationTypeModel, CrewMemberTypeModel } from 'src/app/model-types';
import { AlertService } from 'src/app/shared/components/alert-notifications';


@Component({
  selector: 'qualification-type-settings',
  templateUrl: 'qualification-type-settings.component.html',
  styleUrls: ['./qualification-type-settings.component.css'],
})
export class QualificationTypeSettingsComponent implements OnInit, OnChanges {

  @Input() accessLevel: string;
  editingPermissionsEnabled: boolean = false;

  qualificationTypes: QualificationTypeModel[];
  crewMemberTypes: CrewMemberTypeModel[];
  crewMemberTypeNamesAvailableForSelection = [];
  isLoading = true;
  qualificationTypeSettingsForm = this.formBuilder.group({
      qualificationTypeID: [''],
      qualificationTypeName: [''],
      qualificationTypeCrewMemberTypeID: [''],

  });

  displayedColumns: string[] = ['select', 'id', 'name', 'crew_member_type_id'];  // Possible to refactor so Component doesn't need to know column names?
  dataSource: MatTableDataSource<QualificationTypeModel>;
  selection = new SelectionModel<QualificationTypeModel>(true, []);

  constructor(
    private formBuilder: FormBuilder,
    protected alertService: AlertService,
    public qualificationTypeService: QualificationTypeService,
    public crewMemberTypeService: CrewMemberTypeService,
  ){}

  ngOnInit(): void {
    this.isLoading = true;
    this.qualificationTypeService.getQualificationTypes().subscribe(data => {
      this.qualificationTypes = data;
      this.qualificationTypeSettingsForm.get('qualificationTypeID').setValidators([invalidUpdateIDValidator(this.qualificationTypes)]);
      this.dataSource = new MatTableDataSource<QualificationTypeModel>(this.qualificationTypes);
      this.isLoading = false;
    });

    this.crewMemberTypeService.getCrewMemberTypes().subscribe(data => {
      this.crewMemberTypes = data;
      this.crewMemberTypeNamesAvailableForSelection = this.crewMemberTypes.map(value => value.name);
    })
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes.accessLevel && changes.accessLevel.currentValue === 'advanced') {
      // Any access level (basic, advanced) should be able to edit squadron level data.
      this.editingPermissionsEnabled = true;
    }

  }
  
  onSubmit() {
    // Ignore whatever ID was passed into the form for adding a new record - let the DB create it.  Pass fake placeholder.
    const newQualificationTypeID = -1;
    const newQualificationTypeName = this.qualificationTypeSettingsForm.value.qualificationTypeName;
    const newQualificationTypeCrewMemberTypeID = this.qualificationTypeSettingsForm.value.qualificationTypeCrewMemberTypeID;

    this.qualificationTypeService.addQualificationType(newQualificationTypeID, newQualificationTypeName, newQualificationTypeCrewMemberTypeID).subscribe(data => {
      this.qualificationTypes.push(data);
      this.resetQualificationTypeForm();
    })
  }

  onUpdate() {
    const currentQualificationTypeID = this.qualificationTypeSettingsForm.value.qualificationTypeID;
    const updatedQualificationTypeName = this.qualificationTypeSettingsForm.value.qualificationTypeName;
    const updatedQualificationTypeCrewMemberTypeID = this.qualificationTypeSettingsForm.value.qualificationTypeCrewMemberTypeID;

    let currentQualificationTypeOnRecord: QualificationTypeModel = this.qualificationTypes.find(element => element.id == currentQualificationTypeID);
    if (currentQualificationTypeOnRecord) {
      this.qualificationTypeService.updateQualificationType(currentQualificationTypeID, updatedQualificationTypeName, updatedQualificationTypeCrewMemberTypeID).subscribe(data => {
        // Assumes values used are valid, if successfully updated database and passed form validation.
        currentQualificationTypeOnRecord.name = updatedQualificationTypeName;
        currentQualificationTypeOnRecord.crew_member_type_id = updatedQualificationTypeCrewMemberTypeID;

        this.resetQualificationTypeForm();
      })

    } else {
      this.alertService.error("Error: Record not found to update.");
    }
  }

  onDelete() {
    // Only the rows that have been selected will be deleted, based on id.
    const qualificationTypesToDelete = this.selection.selected.values();
    for (let deleteType of qualificationTypesToDelete) {
      this.qualificationTypeService.deleteQualificationType(deleteType.id).subscribe(data => {
        // Rather than hit the DB for a list of remaining records, simply filter out the id known to be deleted after success.
        this.qualificationTypes = this.qualificationTypes.filter(qualificationType => qualificationType.id != deleteType.id);
        this.resetQualificationTypeForm();
      })
    }
    this.selection.clear();
  }

  get qualificationTypeID() {
    return this.qualificationTypeSettingsForm.get('qualificationTypeID');
  }

  get qualificationTypeName() {
    return this.qualificationTypeSettingsForm.get('qualificationTypeName');
  }

  get qualificationTypeCrewMemberTypeID() {
    return this.qualificationTypeSettingsForm.get('qualificationTypeCrewMemberTypeID');
  }

  updateQualificationTypeFormAfterIDSelected() {
    // Fill out the form for update after a known primary key is entered, allowing for quicker editing by user.
    let qualificationTypeIDForUpdate = this.qualificationTypeSettingsForm.value.qualificationTypeID;
    if (qualificationTypeIDForUpdate) {
      let qualificationType = this.qualificationTypes.find(element => element.id == qualificationTypeIDForUpdate);
      if (qualificationType) {
        // Only make changes if the key matches a record.
        this.qualificationTypeSettingsForm.patchValue({
          qualificationTypeName: qualificationType.name,
          qualificationTypeCrewMemberTypeID: qualificationType.crew_member_type_id,
        });
      }
    }
  }

  autoFillFormAfterRowSelection(row_selected: boolean) {
    if (row_selected) {
      if (this.selection.selected.length == 1) {
        const qualificationTypesToAutoFill = this.selection.selected.values();
        for (let qualificationType of qualificationTypesToAutoFill) {
          // Should only be one qualification type.
          this.qualificationTypeSettingsForm.patchValue({
            qualificationTypeID: qualificationType.id,
          });
          this.updateQualificationTypeFormAfterIDSelected();
        }
      }
    }
  }

  resetQualificationTypeForm() {
    this.dataSource = new MatTableDataSource<QualificationTypeModel>(this.qualificationTypes);
    this.qualificationTypeSettingsForm.reset();

    // Must reset the validators, to prevent false positives after change to flight data.
    this.qualificationTypeSettingsForm.get('qualificationTypeID').setValidators([invalidUpdateIDValidator(this.qualificationTypes)]);
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
  checkboxLabel(row?: QualificationTypeModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

}