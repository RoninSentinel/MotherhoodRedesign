  
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Validators, FormBuilder} from '@angular/forms';

import { LineTypeService } from '../../../services/line-type.service';
import { forbiddenNameValidator } from '../../../validators/forbidden-name.validator';


@Component({
  selector: 'line-type-settings',
  templateUrl: 'line-type-settings.component.html',
  //styleUrls: ['../../../../styles.css']
})
export class LineTypeSettingsComponent implements OnInit, OnChanges {

  @Input() accessLevel: string;
  editingPermissionsEnabled: boolean = false;

  lineTypes = [];
  isLoading = true;
  lineTypeSettingsForm = this.formBuilder.group({
    lineTypeName: [''],
  });

  constructor(
    private formBuilder: FormBuilder,
    public lineTypeService: LineTypeService,
  ){}

  ngOnInit(): void {
    this.isLoading = true;
    this.lineTypeService.getLineTypes().subscribe(data => {
      this.lineTypes = data;
      this.lineTypeSettingsForm.get('lineTypeName').setValidators([Validators.required, forbiddenNameValidator(this.lineTypes)]);
      this.isLoading = false;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.accessLevel && changes.accessLevel.currentValue === 'advanced') {
      // Any access level (basic, advanced) should be able to edit squadron level data.
      this.editingPermissionsEnabled = true;
    }

  }

  lineTypeSelectedFromList(lineTypeSelected: string) {
    this.lineTypeSettingsForm.patchValue({lineTypeName: lineTypeSelected});
  }
  
  onSubmit(){
    const newLineTypeName = this.lineTypeSettingsForm.value.lineTypeName;
    this.lineTypeService.addLineType(newLineTypeName).subscribe(data => {
      this.lineTypes.push(data);
      this.lineTypeSettingsForm.reset();
    })
  }

  onDelete() {
    const lineTypeToDelete = this.lineTypeSettingsForm.value.lineTypeName;
    this.lineTypeService.deleteLineType(lineTypeToDelete).subscribe(data => {
      this.lineTypes = this.lineTypes.filter(lineType => lineType.name !== lineTypeToDelete);
      this.lineTypeSettingsForm.reset();
    })
  }

  get lineTypeName() {
    return this.lineTypeSettingsForm.get('lineTypeName');
  }

}