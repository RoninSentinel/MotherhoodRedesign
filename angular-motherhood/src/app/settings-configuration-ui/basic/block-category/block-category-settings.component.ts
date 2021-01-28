import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Validators, FormBuilder} from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import { UpperCasePipe } from '@angular/common';

import { BlockCategoryService } from '../../../services/block-category.service';
import { forbiddenNameValidator } from '../../../validators/forbidden-name.validator';
import { invalidUpdateIDValidator } from '../../../validators/invalid-update-id.validator';
import { BlockCategoryModel } from 'src/app/model-types';
import { hexToRgb } from '../../../helpers/hex-to-rgb.helper';
import { AlertService } from 'src/app/shared/components/alert-notifications';


@Component({
  selector: 'block-category-settings',
  templateUrl: 'block-category-settings.component.html',
  styleUrls: ['./block-category-settings.component.css'],
})
export class BlockCategorySettingsComponent implements OnInit, OnChanges {

  @Input() accessLevel: string;
  editingPermissionsEnabled: boolean = false;

  private _blockCategorySubscription;
  blockCategories: BlockCategoryModel[];

  currentSquadron: string;
  isLoading = false;
  blockCategorySettingsForm = this.formBuilder.group({
      blockCategoryID: [''],
      blockCategoryName: [''],
      blockCategoryShortName: [''],
      blockCategoryColor: [''],
      blockCategoryIsActive: [''],
      blockCategorySquadronID: [''],

  });

  displayedColumns: string[] = ['select', 'id', 'name', 'short_name', 'color', 'is_active', 'squadron_id'];  // Possible to refactor so Component doesn't need to know column names?
  dataSource: MatTableDataSource<BlockCategoryModel>;
  selection = new SelectionModel<BlockCategoryModel>(true, []);

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private upperCasePipe: UpperCasePipe,
    protected alertService: AlertService,
    public blockCategoryService: BlockCategoryService,
  ){}

  ngOnInit(): void {
    this.currentSquadron = this.route.snapshot.paramMap.get('squadron');
    this.blockCategoryService.setFilter(this.currentSquadron);

    this.isLoading = true;

    this.blockCategorySettingsForm.get('blockCategoryName').setValidators([Validators.required, forbiddenNameValidator(this.blockCategories)]);
    this.blockCategorySettingsForm.get('blockCategoryID').setValidators([invalidUpdateIDValidator(this.blockCategories)]);
    this.dataSource = new MatTableDataSource<BlockCategoryModel>(this.blockCategories);

    this._blockCategorySubscription = this.blockCategoryService.blockCategories$.subscribe(data => {
      this.blockCategories = data;
      this.blockCategorySettingsForm.get('blockCategoryName').setValidators([Validators.required, forbiddenNameValidator(this.blockCategories)]);
      this.blockCategorySettingsForm.get('blockCategoryID').setValidators([invalidUpdateIDValidator(this.blockCategories)]);
      this.dataSource = new MatTableDataSource<BlockCategoryModel>(this.blockCategories);
      this.resetBlockCategoryForm();
      
      this.isLoading = false;
    });

    this.blockCategorySettingsForm.patchValue({blockCategorySquadronID: this.currentSquadron});

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.accessLevel && changes.accessLevel.currentValue) {
      // Any access level (basic, advanced) should be able to edit squadron level data.
      this.editingPermissionsEnabled = true;
    }

  }

  ngOnDestroy() {
    this._blockCategorySubscription.unsubscribe();
  }
  
  onSubmit() {
    // Ignore whatever ID was passed into the form for adding a new record - let the DB create it.  Pass fake placeholder.
    const newBlockCategoryID = -1;
    const newBlockCategoryName = this.blockCategorySettingsForm.value.blockCategoryName;
    const newBlockCategoryShortName = this.blockCategorySettingsForm.value.blockCategoryShortName;
    const newBlockCategoryColor = this.blockCategorySettingsForm.value.blockCategoryColor.toHexString();  // color-picker Color 
    const newBlockCategoryIsActive = this.blockCategorySettingsForm.value.blockCategoryIsActive;
    const newBlockCategorySquadronID = this.blockCategorySettingsForm.value.blockCategorySquadronID;

    this.blockCategoryService.addBlockCategory(newBlockCategoryID, newBlockCategoryName, newBlockCategoryShortName, newBlockCategoryColor, newBlockCategoryIsActive, newBlockCategorySquadronID);
    
  }

  onUpdate() {
    const currentblockCategoryID = this.blockCategorySettingsForm.value.blockCategoryID;
    let updatedBlockCategoryName = this.blockCategorySettingsForm.value.blockCategoryName;
    let updatedBlockCategoryShortName = this.blockCategorySettingsForm.value.blockCategoryShortName;
    
    let updatedBlockCategoryColor: string;
    if (this.blockCategorySettingsForm.value.blockCategoryColor) {
        updatedBlockCategoryColor = this.blockCategorySettingsForm.value.blockCategoryColor.toHexString();  // color-picker Color
    } 

    let updatedBlockCategoryIsActive = this.blockCategorySettingsForm.value.blockCategoryIsActive;
    let updatedBlockCategorySquadronID = this.blockCategorySettingsForm.value.blockCategorySquadronID;

    let currentBlockCategoryOnRecord: BlockCategoryModel = this.blockCategories.find(element => element.id == currentblockCategoryID);
    if (currentBlockCategoryOnRecord) {
      this.blockCategoryService.updateBlockCategory(currentblockCategoryID, updatedBlockCategoryName, updatedBlockCategoryShortName, updatedBlockCategoryColor, updatedBlockCategoryIsActive, updatedBlockCategorySquadronID)

    } else {
      this.alertService.error("Error: Record not found to update.");
    }
  }

  onDelete() {
    // Only the rows that have been selected will be deleted, based on id.
    let blockCategoriesToDelete = this.selection.selected.values();
    for (let deleteType of blockCategoriesToDelete) {
      this.blockCategoryService.deleteBlockCategory(deleteType.id.toString());
    }
    this.resetBlockCategoryForm();
  }

  get blockCategoryID() {
    return this.blockCategorySettingsForm.get('blockCategoryID');
  }

  get blockCategoryName() {
    return this.blockCategorySettingsForm.get('blockCategoryName');
  }

  get blockCategoryShortName() {
    return this.blockCategorySettingsForm.get('blockCategoryShortName');
  }

  get blockCategoryColor() {
    return this.blockCategorySettingsForm.get('blockCategoryColor');
  }

  get blockCategorySquadronID() {
    return this.blockCategorySettingsForm.get('blockCategorySquadronID');
  }

  updateBlockCategoryFormAfterIDSelected() {
    // Fill out the form for update after a known primary key is entered, allowing for quicker editing by user.
    let blockCategoryIDForUpdate = this.blockCategorySettingsForm.value.blockCategoryID;
    if (blockCategoryIDForUpdate) {
      let blockCategory = this.blockCategories.find(element => element.id == blockCategoryIDForUpdate);
      if (blockCategory) {          
        this.blockCategorySettingsForm.patchValue({
          blockCategoryName: blockCategory.name,
          blockCategoryShortName: blockCategory.short_name,
          blockCategoryColor: hexToRgb(blockCategory.color),
          blockCategoryIsActive: blockCategory.is_active,
          blockCategorySquadronID: this.upperCasePipe.transform(blockCategory.squadron_id),
        });
      }
    }
  }

  autoFillFormAfterRowSelection(row_selected: boolean) {
    if (row_selected) {
      if (this.selection.selected.length == 1) {
        const blockCategoriesToAutoFill = this.selection.selected.values();
        for (let blockCategory of blockCategoriesToAutoFill) {
          // Should only be one block category.
          this.blockCategorySettingsForm.patchValue({
            blockCategoryID: blockCategory.id,
          });
          this.updateBlockCategoryFormAfterIDSelected();
        }
      }
    }
  }

  resetBlockCategoryForm() {
    this.dataSource = new MatTableDataSource<BlockCategoryModel>(this.blockCategories);
    this.blockCategorySettingsForm.reset();
    this.blockCategorySettingsForm.patchValue({blockCategorySquadronID: this.upperCasePipe.transform(this.currentSquadron)});

    // Must reset the validators, to prevent false positives after change to crew member data.
    this.blockCategorySettingsForm.get('blockCategoryName').setValidators([Validators.required, forbiddenNameValidator(this.blockCategories)]);
    this.blockCategorySettingsForm.get('blockCategoryID').setValidators([invalidUpdateIDValidator(this.blockCategories)]);

    this.selection.clear()
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
  checkboxLabel(row?: BlockCategoryModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

}