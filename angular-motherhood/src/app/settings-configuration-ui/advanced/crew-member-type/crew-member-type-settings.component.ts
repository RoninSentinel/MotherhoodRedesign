import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Validators, FormBuilder} from '@angular/forms';

import { CrewMemberTypeService } from '../../../services/crew-member-type.service';
import { forbiddenNameValidator } from '../../../validators/forbidden-name.validator';


@Component({
  selector: 'crew-member-type-settings',
  templateUrl: 'crew-member-type-settings.component.html',
})
export class CrewMemberTypeSettingsComponent implements OnInit, OnChanges {

  @Input() accessLevel: string;
  editingPermissionsEnabled: boolean = false;

  crewMemberTypes = [];
  isLoading = true;
  crewMemberTypeSettingsForm = this.formBuilder.group({
    crewMemberTypeName: [''],
  });

  constructor(
    private formBuilder: FormBuilder,
    public crewMemberTypeService: CrewMemberTypeService,
  ){}

  ngOnInit(): void {
    this.isLoading = true;
    this.crewMemberTypeService.getCrewMemberTypes().subscribe(data => {
      this.crewMemberTypes = data;
      this.crewMemberTypeSettingsForm.get('crewMemberTypeName').setValidators([Validators.required, forbiddenNameValidator(this.crewMemberTypes)]);
      this.isLoading = false;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.accessLevel && changes.accessLevel.currentValue === 'advanced') {
      // Any access level (basic, advanced) should be able to edit squadron level data.
      this.editingPermissionsEnabled = true;
    }

  }

  crewMemberTypeSelectedFromList(crewMemberTypeSelected: string) {
    this.crewMemberTypeSettingsForm.patchValue({crewMemberTypeName: crewMemberTypeSelected});
  }
  
  onSubmit(){
    const newCrewMemberTypeName = this.crewMemberTypeSettingsForm.value.crewMemberTypeName;
    this.crewMemberTypeService.addCrewMemberType(newCrewMemberTypeName).subscribe(data => {
      this.crewMemberTypes.push(data);
      this.crewMemberTypeSettingsForm.reset();
    })
  }

  onDelete() {
    const crewMemberTypeToDelete = this.crewMemberTypeSettingsForm.value.crewMemberTypeName;
    this.crewMemberTypeService.deleteCrewMemberType(crewMemberTypeToDelete).subscribe(data => {
      this.crewMemberTypes = this.crewMemberTypes.filter(crewMemberType => crewMemberType.name !== crewMemberTypeToDelete);
      this.crewMemberTypeSettingsForm.reset();
    })
  }

  get crewMemberTypeName() {
    return this.crewMemberTypeSettingsForm.get('crewMemberTypeName');
  }

}