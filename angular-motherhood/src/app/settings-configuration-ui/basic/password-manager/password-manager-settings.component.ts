import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';

import { invalidUpdateIDValidator } from '../../../validators/invalid-update-id.validator';
import { AdminTokenModel } from 'src/app/model-types';
import { ActivatedRoute } from '@angular/router';
import { AdminTokenService } from 'src/app/services/admin-token.service';
import { AlertService } from 'src/app/shared/components/alert-notifications';
import { UpperCasePipe } from '@angular/common';
import { forbiddenCodeValidator } from 'src/app/validators/forbidden-code.validator';


@Component({
  selector: 'password-manager-settings',
  templateUrl: 'password-manager-settings.component.html',
  styleUrls: ['./password-manager-settings.component.css'],
})
export class PasswordManagerSettingsComponent implements OnInit, OnChanges {

  @Input() accessLevel: string;
  editingPermissionsEnabled: boolean = false;

  currentSquadron: string;
  adminTokens = [];
  isLoading = true;
  adminTokenSettingsForm = this.formBuilder.group({
      adminTokenID: [''],
      adminTokenCode: [''],
      adminTokenAccessLevel: [''],
      adminTokenSquadronID: [''],
      adminTokenIsActive: [''],

  });

  displayedColumns: string[] = ['select', 'id', 'code', 'access_level', 'squadron_id', 'is_active'];  
  dataSource: MatTableDataSource<AdminTokenModel>;
  selection = new SelectionModel<AdminTokenModel>(true, []);

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private upperCasePipe: UpperCasePipe,
    protected alertService: AlertService,
    public adminTokenService: AdminTokenService,
  ){}

  ngOnInit(): void {
    this.currentSquadron = this.route.snapshot.paramMap.get('squadron');
    this.adminTokenSettingsForm.patchValue({adminTokenSquadronID: this.currentSquadron});
    this.adminTokenSettingsForm.patchValue({adminTokenAccessLevel: "basic"});

    this.isLoading = true;
    this.adminTokenService.getAdminTokens(this.currentSquadron).subscribe(data => {
      this.adminTokens = data;
      this.adminTokenSettingsForm.get('adminTokenID').setValidators([invalidUpdateIDValidator(this.adminTokens)]);
      this.adminTokenSettingsForm.get('adminTokenCode').setValidators([Validators.required, forbiddenCodeValidator(this.adminTokens)]);
      this.resetAdminTokenForm();
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
      const newAdminTokenID = -1;
      const newAdminTokenCode = this.adminTokenSettingsForm.value.adminTokenCode;
      const newAdminTokenAccessLevel = this.adminTokenSettingsForm.value.adminTokenAccessLevel;
      const newAdminTokenSquadronID = this.adminTokenSettingsForm.value.adminTokenSquadronID;
      const newAdminTokenIsActive = this.adminTokenSettingsForm.value.adminTokenIsActive;

      this.adminTokenService.addAdminToken(newAdminTokenID, newAdminTokenCode, newAdminTokenAccessLevel, newAdminTokenSquadronID, newAdminTokenIsActive).subscribe(data => {        
      this.adminTokens.push(data);
      this.resetAdminTokenForm();
      })
  }

  onUpdate() {
      const currentAdminTokenID = this.adminTokenSettingsForm.value.adminTokenID;
      const updatedAdminTokenCode = this.adminTokenSettingsForm.value.adminTokenCode;
      const updatedAdminTokenAccessLevel = this.adminTokenSettingsForm.value.adminTokenAccessLevel;
      const updatedAdminTokenSquadronID = this.adminTokenSettingsForm.value.adminTokenSquadronID;
      const updatedAdminTokenIsActive = this.adminTokenSettingsForm.value.adminTokenIsActive;

      let currentAdminTokenOnRecord: AdminTokenModel = this.adminTokens.find(token => token.id == currentAdminTokenID);
      
      if (currentAdminTokenOnRecord) {

        let currentAdminTokenCode = currentAdminTokenOnRecord.code;
        currentAdminTokenOnRecord.code = updatedAdminTokenCode;
  
        let duplicateCodes: AdminTokenModel[] = this.adminTokens.filter(token => token.code == updatedAdminTokenCode);
    
        if (duplicateCodes.length > 1) {
          currentAdminTokenOnRecord.code = currentAdminTokenCode;  // Set back to previous value.
          this.alertService.error("Error: A record with that admin token code already exists.  Update aborted.");
          return;
        }

        this.adminTokenService.updateAdminToken(currentAdminTokenID, updatedAdminTokenCode, updatedAdminTokenAccessLevel, updatedAdminTokenSquadronID, updatedAdminTokenIsActive).subscribe(data => {
            // Assumes values used are valid, if successfully updated database and passed form validation.
            currentAdminTokenOnRecord.code = updatedAdminTokenCode;
            currentAdminTokenOnRecord.access_level = updatedAdminTokenAccessLevel;
            currentAdminTokenOnRecord.squadron_id = updatedAdminTokenSquadronID;
            currentAdminTokenOnRecord.is_active = updatedAdminTokenIsActive;
            
            this.resetAdminTokenForm();
            this.selection.clear();
        });

      } else {
        this.alertService.error("Error: Record not found to update.");
      }
  }

  onDelete() {
    // Only the rows that have been selected will be deleted, based on id.
    const adminTokensToDelete = this.selection.selected.values();
    for (let deleteType of adminTokensToDelete) {
      this.adminTokenService.deleteAdminToken(deleteType.id).subscribe(data => {
        // Rather than hit the DB for a list of remaining records, simply filter out the id known to be deleted after success.
        this.adminTokens = this.adminTokens.filter(adminToken => adminToken.id != deleteType.id);
        this.resetAdminTokenForm();
      })
    }
    this.selection.clear();
  }

  get adminTokenID() {
    return this.adminTokenSettingsForm.get('adminTokenID');
  }

  get adminTokenCode() {
    return this.adminTokenSettingsForm.get('adminTokenCode');
  }

  get adminTokenAccessLevel() {
    return this.adminTokenSettingsForm.get('adminTokenAccessLevel');
  }

  get adminTokenSquadronID() {
    return this.adminTokenSettingsForm.get('adminTokenSquadronID');
  }

  get adminTokenIsActive() {
      return this.adminTokenSettingsForm.get('adminTokenIsActive');
  }

  updateAdminTokenFormAfterIDSelected() {
    // Fill out the form for update after a known primary key is entered, allowing for quicker editing by user.
    let adminTokenIDForUpdate = this.adminTokenSettingsForm.value.adminTokenID;
    if (adminTokenIDForUpdate) {
      let adminToken = this.adminTokens.find(element => element.id == adminTokenIDForUpdate);
      if (adminToken) {          
        this.adminTokenSettingsForm.patchValue({
          adminTokenCode: adminToken.code,
          adminTokenAccessLevel: adminToken.access_level,
          adminTokensquadronID: this.upperCasePipe.transform(adminToken.squadron_id),
          adminTokenIsActive: adminToken.is_active,
        });
      }
    }
  }

  autoFillFormAfterRowSelection(row_selected: boolean) {
    if (row_selected) {
      if (this.selection.selected.length == 1) {
        const adminTokensToAutoFill = this.selection.selected.values();
        for (let adminToken of adminTokensToAutoFill) {
          // Should only be one line template.
          this.adminTokenSettingsForm.patchValue({
            adminTokenID: adminToken.id,
          });
          this.updateAdminTokenFormAfterIDSelected();
        }
      }
    }
  }

  resetAdminTokenForm() {
    this.dataSource = new MatTableDataSource<AdminTokenModel>(this.adminTokens);
    this.adminTokenSettingsForm.reset();
    this.adminTokenSettingsForm.patchValue({adminTokenSquadronID: this.upperCasePipe.transform(this.currentSquadron)});
    this.adminTokenSettingsForm.patchValue({adminTokenAccessLevel: "basic"});

    // Must reset the validators, to prevent false positives after change to admin token data.
    this.adminTokenSettingsForm.get('adminTokenCode').setValidators([Validators.required, forbiddenCodeValidator(this.adminTokens)]);
    this.adminTokenSettingsForm.get('adminTokenID').setValidators([invalidUpdateIDValidator(this.adminTokens)]);
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
  checkboxLabel(row?: AdminTokenModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

}