import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';

import { LineTemplateService } from '../../../services/line-template.service';
import { LineTypeService } from '../../../services/line-type.service';
import { AORsService } from '../../../services/aors.service';
import { invalidUpdateIDValidator } from '../../../validators/invalid-update-id.validator';
import { LineTemplateModel } from 'src/app/model-types';
import { ActivatedRoute } from '@angular/router';
import { hexToRgb } from '../../../helpers/hex-to-rgb.helper';
import { AlertService } from 'src/app/shared/components/alert-notifications';
import { UpperCasePipe } from '@angular/common';


@Component({
  selector: 'line-template-settings',
  templateUrl: 'line-template-settings.component.html',
  styleUrls: ['./line-template-settings.component.css'],
})
export class LineTemplateSettingsComponent implements OnInit, OnChanges {

  @Input() accessLevel: string;
  editingPermissionsEnabled: boolean = false;

  lineTemplates = [];
  currentSquadron: string;
  aors = [];
  lineTypes = [];
  aorsAvailableForSelection = [];
  lineTypesAvailableForSelection = [];
  isLoading = true;
  lineTemplateSettingsForm = this.formBuilder.group({
      lineTemplateID: [''],
      lineTemplateName: [''],
      lineTemplateLineTypeID: [''],
      lineTemplateColor: [''],
      lineTemplateIsActive: [''],
      lineTemplateOrderPreference: [''],
      lineTemplateCallSign: [''],
      //lineTemplateIsDefault: [''],
      lineTemplateSquadronID: [''],
      lineTemplateAORID: [''],
      lineTemplateIsHiddenInReadMode: [''],
      lineTemplateExtraFieldName: [''],

  });

  displayedColumns: string[] = ['select', 'id', 'name', 'line_type_id', 'color', 'is_active', 'order_preference', 'call_sign', 'squadron_id', 'aor', 'is_hidden_in_read_mode', 'extra_field_name'];  // Possible to refactor so Component doesn't need to know column names?
  dataSource: MatTableDataSource<LineTemplateModel>;
  selection = new SelectionModel<LineTemplateModel>(true, []);

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private upperCasePipe: UpperCasePipe,
    protected alertService: AlertService,
    public lineTemplateService: LineTemplateService,
    public aorsService: AORsService,
    public lineTypeService: LineTypeService,
  ){}

  ngOnInit(): void {
    this.currentSquadron = this.route.snapshot.paramMap.get('squadron');
    this.lineTemplateSettingsForm.patchValue({lineTemplateSquadronID: this.currentSquadron});

    this.isLoading = true;
    this.lineTemplateService.getLineTemplates(this.currentSquadron).subscribe(data => {
      this.lineTemplates = data;
      this.lineTemplateSettingsForm.get('lineTemplateID').setValidators([invalidUpdateIDValidator(this.lineTemplates)]);
      this.resetLineTemplateForm();
      this.isLoading = false;
    });

    this.aorsService.getAORs().subscribe(data => {
      this.aors = data;
      this.aorsAvailableForSelection = this.aors.map(value => value.name);
    })

    this.lineTypeService.getLineTypes().subscribe(data => {
      this.lineTypes = data;
      this.lineTypesAvailableForSelection = this.lineTypes.map(value => value.name);
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
    const newLineTemplateID = -1;
    const newLineTemplateName = this.lineTemplateSettingsForm.value.lineTemplateName;
    const newLineTemplateLineTypeID = this.lineTemplateSettingsForm.value.lineTemplateLineTypeID;
    const newLineTemplateColor = this.lineTemplateSettingsForm.value.lineTemplateColor.toHexString();
    const newLineTemplateIsActive = this.lineTemplateSettingsForm.value.lineTemplateIsActive;
    const newLineTemplateOrderPreference = this.lineTemplateSettingsForm.value.lineTemplateOrderPreference;
    const newLineTemplateCallSign = this.lineTemplateSettingsForm.value.lineTemplateCallSign;
    //const newLineTemplateIsDefault = this.lineTemplateSettingsForm.value.lineTemplateIsDefault;
    const newLineTemplateSquadronID = this.lineTemplateSettingsForm.value.lineTemplateSquadronID;
    const newLineTemplateAORID = this.lineTemplateSettingsForm.value.lineTemplateAORID;
    const newLineTemplateIsHiddenInReadMode = this.lineTemplateSettingsForm.value.lineTemplateIsHiddenInReadMode;
    const newLineTemplateExtraFieldName = this.lineTemplateSettingsForm.value.lineTemplateExtraFieldName;

    this.lineTemplateService.addLineTemplate(newLineTemplateID, newLineTemplateName, newLineTemplateLineTypeID, newLineTemplateColor, newLineTemplateIsActive, newLineTemplateOrderPreference, newLineTemplateCallSign, newLineTemplateSquadronID, newLineTemplateAORID, newLineTemplateIsHiddenInReadMode, newLineTemplateExtraFieldName).subscribe(data => {        
      this.lineTemplates.push(data);
      this.resetLineTemplateForm();
    })
  }

  onUpdate() {
    const currentLineTemplateID = this.lineTemplateSettingsForm.value.lineTemplateID;
    const updatedLineTemplateName = this.lineTemplateSettingsForm.value.lineTemplateName;
    const updatedLineTemplateLineTypeID = this.lineTemplateSettingsForm.value.lineTemplateLineTypeID;
    const updatedLineTemplateColor = this.lineTemplateSettingsForm.value.lineTemplateColor.toHexString();
    const updatedLineTemplateIsActive = this.lineTemplateSettingsForm.value.lineTemplateIsActive;
    const updatedLineTemplateOrderPreference = this.lineTemplateSettingsForm.value.lineTemplateOrderPreference;
    const updatedLineTemplateCallSign = this.lineTemplateSettingsForm.value.lineTemplateCallSign;
    //const updatedLineTemplateIsDefault = this.lineTemplateSettingsForm.value.lineTemplateIsDefault;
    const updatedLineTemplateSquadronID = this.lineTemplateSettingsForm.value.lineTemplateSquadronID;
    const updatedLineTemplateAORID = this.lineTemplateSettingsForm.value.lineTemplateAORID;
    const updatedLineTemplateIsHiddenInReadMode = this.lineTemplateSettingsForm.value.lineTemplateIsHiddenInReadMode;
    const updatedLineTemplateExtraFieldName = this.lineTemplateSettingsForm.value.lineTemplateExtraFieldName;

    let currentLineTemplateOnRecord: LineTemplateModel = this.lineTemplates.find(element => element.id == currentLineTemplateID);
    if (currentLineTemplateOnRecord) {
      this.lineTemplateService.updateLineTemplate(currentLineTemplateID, updatedLineTemplateName, updatedLineTemplateLineTypeID, updatedLineTemplateColor, updatedLineTemplateIsActive, updatedLineTemplateOrderPreference, updatedLineTemplateCallSign, updatedLineTemplateSquadronID, updatedLineTemplateAORID, updatedLineTemplateIsHiddenInReadMode, updatedLineTemplateExtraFieldName).subscribe(data => {
        // Assumes values used are valid, if successfully updated database and passed form validation.
        currentLineTemplateOnRecord.name = updatedLineTemplateName;
        currentLineTemplateOnRecord.line_type_id = updatedLineTemplateLineTypeID;
        currentLineTemplateOnRecord.color = updatedLineTemplateColor;
        currentLineTemplateOnRecord.is_active = updatedLineTemplateIsActive;
        currentLineTemplateOnRecord.order_preference = updatedLineTemplateOrderPreference;
        currentLineTemplateOnRecord.call_sign = updatedLineTemplateCallSign;
        //currentLineTemplateOnRecord.is_default = updatedLineTemplateIsDefault;
        currentLineTemplateOnRecord.squadron_id = updatedLineTemplateSquadronID;
        currentLineTemplateOnRecord.aor_id = updatedLineTemplateAORID;
        currentLineTemplateOnRecord.is_hidden_in_read_mode = updatedLineTemplateIsHiddenInReadMode;
        currentLineTemplateOnRecord.extra_field_name = updatedLineTemplateExtraFieldName;

        this.resetLineTemplateForm();
      })

    } else {
      this.alertService.error("Error: Record not found to update.");
    }
  }

  onDelete() {
    // Only the rows that have been selected will be deleted, based on id.
    const lineTemplatesToDelete = this.selection.selected.values();
    for (let deleteType of lineTemplatesToDelete) {
      this.lineTemplateService.deleteLineTemplate(deleteType.id).subscribe(data => {
        // Rather than hit the DB for a list of remaining records, simply filter out the id known to be deleted after success.
        this.lineTemplates = this.lineTemplates.filter(lineTemplate => lineTemplate.id != deleteType.id);
        this.resetLineTemplateForm();
      })
    }
    this.selection.clear();
  }

  get lineTemplateID() {
    return this.lineTemplateSettingsForm.get('lineTemplateID');
  }

  get lineTemplateName() {
    return this.lineTemplateSettingsForm.get('lineTemplateName');
  }

  get lineTemplateLineTypeID() {
    return this.lineTemplateSettingsForm.get('lineTemplateLineTypeID');
  }

  get lineTemplateColor() {
    return this.lineTemplateSettingsForm.get('lineTemplateColor');
  }

  get lineTemplateIsActive() {
    return this.lineTemplateSettingsForm.get('lineTemplateIsActive');
  }

  get lineTemplateOrderPreference() {
    return this.lineTemplateSettingsForm.get('lineTemplateOrderPreference');
  }

  get lineTemplateCallSign() {
    return this.lineTemplateSettingsForm.get('lineTemplateCallSign');
  }

  get lineTemplateSquadronID() {
    return this.lineTemplateSettingsForm.get('lineTemplateSquadronID');
  }

  get lineTemplateAORID() {
    return this.lineTemplateSettingsForm.get('lineTemplateAORID');
  }

  get lineTemplateIsHiddenInReadMode() {
    return this.lineTemplateSettingsForm.get('lineTemplateIsHiddenInReadMode');
  }

  get lineTemplateExtraFieldName() {
    return this.lineTemplateSettingsForm.get('lineTemplateExtraFieldName');
  }

  updateLineTemplateFormAfterIDSelected() {
    // Fill out the form for update after a known primary key is entered, allowing for quicker editing by user.
    let lineTemplateIDForUpdate = this.lineTemplateSettingsForm.value.lineTemplateID;
    if (lineTemplateIDForUpdate) {
      let lineTemplate = this.lineTemplates.find(element => element.id == lineTemplateIDForUpdate);
      if (lineTemplate) {          
        this.lineTemplateSettingsForm.patchValue({
          lineTemplateName: lineTemplate.name,
          lineTemplateLineTypeID: lineTemplate.line_type_id,
          lineTemplateColor: hexToRgb(lineTemplate.color),
          lineTemplateIsActive: lineTemplate.is_active,
          lineTemplateOrderPreference: lineTemplate.order_preference,
          lineTemplateCallSign: lineTemplate.call_sign,
          //lineTemplateIsDefault: lineTemplate.is_default,
          lineTemplateSquadronID: this.upperCasePipe.transform(lineTemplate.squadron_id),
          lineTemplateAORID: lineTemplate.aor_id,
          lineTemplateIsHiddenInReadMode: lineTemplate.is_hidden_in_read_mode,
          lineTemplateExtraFieldName: lineTemplate.extra_field_name,
        });
      }
    }
  }

  autoFillFormAfterRowSelection(row_selected: boolean) {
    if (row_selected) {
      if (this.selection.selected.length == 1) {
        const lineTemplatesToAutoFill = this.selection.selected.values();
        for (let lineTemplate of lineTemplatesToAutoFill) {
          // Should only be one line template.
          this.lineTemplateSettingsForm.patchValue({
            lineTemplateID: lineTemplate.id,
          });
          this.updateLineTemplateFormAfterIDSelected();
        }
      }
    }
  }

  resetLineTemplateForm() {
    this.dataSource = new MatTableDataSource<LineTemplateModel>(this.lineTemplates);
    this.lineTemplateSettingsForm.reset();
    this.lineTemplateSettingsForm.patchValue({lineTemplateSquadronID: this.upperCasePipe.transform(this.currentSquadron)});

    // Must reset the validators, to prevent false positives after change to crew member data.
    this.lineTemplateSettingsForm.get('lineTemplateID').setValidators([invalidUpdateIDValidator(this.lineTemplates)]);

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
  checkboxLabel(row?: LineTemplateModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

}