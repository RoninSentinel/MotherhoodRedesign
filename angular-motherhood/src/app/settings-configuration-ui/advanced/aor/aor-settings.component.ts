  
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Validators, FormBuilder} from '@angular/forms';

import { AORsService } from '../../../services/aors.service';
import {forbiddenNameValidator} from '../../../validators/forbidden-name.validator';


@Component({
  selector: 'aor-settings',
  templateUrl: 'aor-settings.component.html',
  //styleUrls: ['../../../../styles.css']
})
export class AORSettingsComponent implements OnInit, OnChanges {

  @Input() accessLevel: string;
  editingPermissionsEnabled: boolean = false;

  aors = [];
  isLoading = true;
  aorSettingsForm = this.formBuilder.group({
    aorName: [''],
  });

  constructor(
    private formBuilder: FormBuilder,
    public aorsService: AORsService,
  ){}

  ngOnInit(): void {
    this.isLoading = true;
    this.aorsService.getAORs().subscribe(data => {
      this.aors = data;
      this.aorSettingsForm.get('aorName').setValidators([Validators.required, forbiddenNameValidator(this.aors)]);
      this.isLoading = false;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.accessLevel && changes.accessLevel.currentValue === 'advanced') {
      // Any access level (basic, advanced) should be able to edit squadron level data.
      this.editingPermissionsEnabled = true;
    }

  }

  aorSelectedFromList(aorSelected: string) {
    this.aorSettingsForm.patchValue({aorName: aorSelected});
  }
  
  onSubmit(){
    const newAORName = this.aorSettingsForm.value.aorName;
    this.aorsService.addAOR(newAORName).subscribe(data => {
      this.aors.push(data);
      this.aorSettingsForm.reset();
    })
  }

  onDelete() {
    const aorToDelete = this.aorSettingsForm.value.aorName;
    this.aorsService.deleteAOR(aorToDelete).subscribe(data => {
      this.aors = this.aors.filter(aor => aor.name !== aorToDelete);
      this.aorSettingsForm.reset();
    })
  }

  get aorName() {
    return this.aorSettingsForm.get('aorName');
  }

}