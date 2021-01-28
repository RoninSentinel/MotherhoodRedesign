  
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Validators, FormBuilder} from '@angular/forms';

import { SquadronService } from '../../../services/squadron.service';
import { forbiddenNameValidator } from '../../../validators/forbidden-name.validator';


@Component({
  selector: 'squadron-settings',
  templateUrl: 'squadron-settings.component.html',
  //styleUrls: ['../../../../styles.css']
})
export class SquadronSettingsComponent implements OnInit, OnChanges {

  @Input() accessLevel: string;
  editingPermissionsEnabled: boolean = false;

  squadrons = [];
  isLoading = true;
  squadronSettingsForm = this.formBuilder.group({
    squadronName: [''],
  });

  constructor(
    private formBuilder: FormBuilder,
    public squadronService: SquadronService,
  ){}

  ngOnInit(): void {
    this.isLoading = true;
    this.squadronService.getSquadrons().subscribe(data => {
      this.squadrons = data;
      this.squadronSettingsForm.get('squadronName').setValidators([Validators.required, forbiddenNameValidator(this.squadrons)]);
      this.isLoading = false;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.accessLevel && changes.accessLevel.currentValue === 'advanced') {
      // Any access level (basic, advanced) should be able to edit squadron level data.
      this.editingPermissionsEnabled = true;
    }

  }

  squadronSelectedFromList(squadronSelected: string) {
    this.squadronSettingsForm.patchValue({squadronName: squadronSelected});
  }
  
  onSubmit(){
    const newsquadronName = this.squadronSettingsForm.value.squadronName;
    this.squadronService.addSquadron(newsquadronName).subscribe(data => {
      this.squadrons.push(data);
      this.squadronSettingsForm.reset();
    })
  }

  onDelete() {
    const squadronToDelete = this.squadronSettingsForm.value.squadronName;
    this.squadronService.deleteSquadron(squadronToDelete).subscribe(data => {
      this.squadrons = this.squadrons.filter(squadron => squadron.name !== squadronToDelete);
      this.squadronSettingsForm.reset();
    })
  }

  get squadronName() {
    return this.squadronSettingsForm.get('squadronName');
  }

}