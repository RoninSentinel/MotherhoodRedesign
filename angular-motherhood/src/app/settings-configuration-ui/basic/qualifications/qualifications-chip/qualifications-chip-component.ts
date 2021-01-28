import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { QualificationsModel, QualificationTypeModel } from 'src/app/model-types';
import { QualificationTypeService } from 'src/app/services/qualification-type.service';
import { QualificationsService } from 'src/app/services/qualifications.service';
import { AlertService } from 'src/app/shared/components/alert-notifications';

@Component({
  selector: 'qualifications-chip',
  templateUrl: 'qualifications-chip.component.html',
  styleUrls: ['qualifications-chip.component.css'],
})
export class QualificationsChipComponent implements OnInit, OnChanges {
  @Input() currentCrewMemberID: number;
  @Input() crewMemberTypeID: string;
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  qualificationsCtrl = new FormControl();
  filteredQualifications: Observable<string[]>;
  qualifications: QualificationsModel[];
  qualificationTypes: QualificationTypeModel[];
  qualificationNamesAssigned: string[] = [];
  qualificationsAvailableForSelection: string[] = [];

  duplicateNameError: boolean = false;
  invalidNameError: boolean = false;

  @ViewChild('qualificationInput') qualificationInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    protected alertService: AlertService,
    public qualificationsService: QualificationsService,
    public qualificationTypeService: QualificationTypeService,
  ) {}

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentCrewMemberID && changes.currentCrewMemberID.currentValue) {
      // The crew member ID has changed. Get all assigned qualifications for crew member.
      this.qualificationsService.getQualifications([changes.currentCrewMemberID.currentValue]).subscribe(data => {
        this.qualifications = data;
        this.qualificationNamesAssigned = this.qualifications.map(value => value.qualification_type.name);
      })

    }

    if (changes.crewMemberTypeID && changes.crewMemberTypeID.currentValue) {
      this.qualificationTypeService.getQualificationTypes(changes.crewMemberTypeID.currentValue).subscribe( data => {
        this.qualificationTypes = data;
        this.qualificationsAvailableForSelection = this.qualificationTypes.map(value => value.name);
        
        this.filteredQualifications = this.qualificationsCtrl.valueChanges.pipe(
          startWith(null),  // Not deprecated: https://stackoverflow.com/questions/56571406/is-the-startwith-operator-in-rxjs-really-deprecated
          map((qualification_name: string | null) => qualification_name ? this._filter(qualification_name) : this.qualificationsAvailableForSelection.slice())
        );
      })
    }

  }

  add(event: MatChipInputEvent): void {
    // Will trigger when ENTER and COMMA are used.
    const input = event.input;
    const value = event.value;

    // Add the qualification
    if ((value || '').trim()) {
      
      if (this.qualificationNamesAssigned.find(name => name === value.trim())) {
        this.duplicateNameError = true;
        this.invalidNameError = false;

      } else if (this.qualificationsAvailableForSelection.find(name => name === value.trim())) {
        this.duplicateNameError = false;
        this.invalidNameError = false;

        this.qualificationNamesAssigned.push(value.trim());
        this.addQualificationToCrewMember(value.trim());

      } else {
        this.duplicateNameError = false;
        this.invalidNameError = true;

      }

    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.qualificationsCtrl.patchValue(null);
    
  }

  remove(qualification: string): void {
    const index = this.qualificationNamesAssigned.indexOf(qualification);

    if (index >= 0) {
      this.qualificationNamesAssigned.splice(index, 1);
      this.removeQualificationFromCrewMember(qualification);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let nameToAdd: string = event.option.viewValue;

    if (this.qualificationNamesAssigned.find(name => name === nameToAdd)) {
      this.duplicateNameError = true;
      this.invalidNameError = false;

    } else if (this.qualificationsAvailableForSelection.find(name => name === nameToAdd)) {
      this.duplicateNameError = false;
      this.invalidNameError = false;

      this.qualificationNamesAssigned.push(event.option.viewValue);
      this.addQualificationToCrewMember(event.option.viewValue);

    } else {
      this.duplicateNameError = false;
      this.invalidNameError = true;
    }

    this.qualificationInput.nativeElement.value = '';
    this.qualificationInput.nativeElement.blur();
    this.qualificationsCtrl.setValue(null);
    
  }

  addQualificationToCrewMember(newQualification: string) {
    let selectedQualificationType = this.qualificationTypes.find(qualificationType => qualificationType.name === newQualification);
    if (selectedQualificationType) {
      this.qualificationsService.addQualifications(0, this.currentCrewMemberID, selectedQualificationType.id).subscribe(data => {
        this.qualifications.push(data);
      })
    } else {
      this.alertService.error("Error: Unknown qualification attempting to be added.");

    }
  }

  removeQualificationFromCrewMember(qualificationTypeNameToRemove: string) {
    let selectedQualificationType = this.qualificationTypes.find(qualificationType => qualificationType.name === qualificationTypeNameToRemove);
    if (selectedQualificationType) {
      let qualificationToRemove = this.qualifications.find(qualification => qualification.qualification_type_id == selectedQualificationType.id);
      if (qualificationToRemove) {
        this.qualificationsService.deleteQualifications(qualificationToRemove.id).subscribe(data => {
          this.qualifications = this.qualifications.filter(qualification => qualification.id != qualificationToRemove.id);
        })
      } else {
        this.alertService.error("Error: Qualification not found.");

      }
    } else {
      this.alertService.error("Error: Qualification Type not found.");

    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.qualificationsAvailableForSelection.filter(qualification => qualification.toLowerCase().indexOf(filterValue) === 0);
  }
}
