import { Component, Input, OnChanges, OnInit, SimpleChanges, AfterViewInit, AfterViewChecked, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { LineInstanceModel, LineTemplateModel, MotherhoodShiftScheduleModel } from 'src/app/model-types';
import { AlertService } from 'src/app/shared/components/alert-notifications';
import { MotherhoodSchedulerService } from 'src/app/services/motherhood-scheduler.service';
import { LineTemplateService } from 'src/app/services/line-template.service';
import { valueInListValidator } from 'src/app/validators/value-in-list.validator';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'motherhood-add-line',
  templateUrl: 'motherhood-add-line.component.html',
  styleUrls: ['./motherhood-add-line.component.css'],
})
export class MotherhoodAddLineComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {

    @ViewChild('lineName') lineNameToAddInput: MatInput;

    @Input() editMode: boolean;

    currentSquadron: string;
    currentShift: string;
    motherhoodShiftSchedule: MotherhoodShiftScheduleModel;

    templateOptions: string[] = [];
    filteredTemplateOptions: Observable<string[]>;

    addLineControl = new FormControl('', {validators: [Validators.required, valueInListValidator(this.templateOptions)]});

    usedNames: string[];

    private _motherhoodShiftScheduleSubscription;
    private _isLoadingSubscription;

    isLoading = false;

    constructor(
      private route: ActivatedRoute,
      protected alertService: AlertService,
      public motherhoodSchedulerService: MotherhoodSchedulerService,
      public lineTemplateService: LineTemplateService,
    ){}

    ngOnInit(): void {
      this.currentSquadron = this.route.snapshot.paramMap.get('squadron');
      this.currentShift = this.route.snapshot.paramMap.get('shift');

      this.setFormValidator();

      this._motherhoodShiftScheduleSubscription = this.motherhoodSchedulerService.motherhoodShiftSchedule$.subscribe(data => {
        this.motherhoodShiftSchedule = data;

        if (!this.usedNames) {
            // Avoid making the API call on every change to the schedule.  
            // Should be good loading it only once at the beginning - but requires motherhoodShiftSchedule data.
            this.generateTemplateOptions();
        } 

      });

      this._isLoadingSubscription = this.motherhoodSchedulerService.isLoading$.subscribe(data => {
        this.isLoading = data;
      });

    }

    ngOnChanges(changes: SimpleChanges) {

    }

    ngAfterViewInit() {

    }

    ngAfterViewChecked() {

    }

    ngOnDestroy() {
      this._motherhoodShiftScheduleSubscription.unsubscribe();
      this._isLoadingSubscription.unsubscribe();
    }

    get lineNameToAdd() {
        return this.addLineControl.value();
      }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.templateOptions.filter(option => option.toLowerCase().includes(filterValue));
    }

    setFilterOptions() {
        this.filteredTemplateOptions = this.addLineControl.valueChanges
        .pipe(
            startWith(''),
            map(value => this._filter(value))
        );
    }

    addActiveLineToSchedule(lineName: string) {
        // Get the form input value.  Check to see if that value is in the list of eligible names.
        // Call the scheduler service to create the line for valid name - error message if not.
        this.motherhoodSchedulerService.createLineForSchedule(lineName);
        this.templateOptions = this.templateOptions.filter(option => option != lineName);
        //this.lineNameToAddInput.value = '';
        this.setFilterOptions();
        this.setFormValidator();

    }

    addLineToOptions(lineInstance: LineInstanceModel) {
        this.templateOptions.push(lineInstance.line_template?.name);
        this.setFilterOptions();
        this.setFormValidator();
    }

    generateTemplateOptions() {
        if (this.motherhoodShiftSchedule) {
            // Pull active templates from the API.  Filter out the ones currently already on the schedule.  Remaining are the 'templateOptions'
            this.lineTemplateService.getLineTemplates(this.currentSquadron, true).subscribe(data => {
                let activeLineTemplates: LineTemplateModel[] = data;
                let activeNames: string[] = activeLineTemplates?.map(template => template.name);

                this.usedNames = [];
                this.motherhoodShiftSchedule?.line_instances.forEach(lineInstance => {
                    this.usedNames.push(lineInstance.line_template?.name);
                });

                if (activeNames) {
                    // https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
                    this.templateOptions = activeNames.filter(name => !this.usedNames.includes(name));
                } else {
                    this.templateOptions = [];
                    this.alertService.info("No line templates are currently set to active.", { 'autoClose': true });
                }
                
                this.setFilterOptions();
                this.setFormValidator();
            });
        } 

    }

    setFormValidator() {
        this.addLineControl.setValidators([Validators.required, valueInListValidator(this.templateOptions)]);
    }

}