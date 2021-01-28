import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, AfterViewInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { setTime } from '@syncfusion/ej2-schedule';
import { AdminTokenModel, MotherhoodShiftScheduleModel } from 'src/app/model-types';
import { AdminTokenService } from 'src/app/services/admin-token.service';
import { MotherhoodSchedulerService } from 'src/app/services/motherhood-scheduler.service';
import { AlertService } from 'src/app/shared/components/alert-notifications';


@Component({
  selector: 'motherhood-menu-controls',
  templateUrl: 'motherhood-menu-controls.component.html',
  styleUrls: ['./motherhood-menu-controls.component.css'],
})
export class MotherhoodMenuControlsComponent implements OnInit, OnChanges, AfterViewInit {

    @Input() shiftDate: Date;

    @Output() loadMotherhoodEvent = new EventEmitter<MotherhoodShiftScheduleModel>();
    @Output() toggleEditModeEvent = new EventEmitter<boolean>();
    @Output() createMotherhoodEvent = new EventEmitter<boolean>();
    @Output() clearMotherhoodEvent = new EventEmitter<boolean>();
    @Output() publishMotherhoodEvent = new EventEmitter<boolean>();
    @Output() deleteMotherhoodEvent = new EventEmitter<boolean>();
    @Output() readonly darkModeSwitched = new EventEmitter<boolean>();

    @ViewChild('darkModeToggle') darkModeToggleSwitch: MatSlideToggle;
    @ViewChild('adminToken') adminTokenInput: ElementRef;
    @ViewChild('editModeToggle') editModeToggleSwitch: MatSlideToggle;

    editMode: boolean = false;
    editModeToggleDisabled: boolean = true;
    hasEditPermissions: boolean;  
    showTokenInput: boolean = false;
    adminTokens: AdminTokenModel[] = [];

    isLoading = false;
    currentSquadron: string;
    currentShift: string;

    private _isLoadingSubscription;
    private _motherhoodShiftScheduleSubscription;
    motherhoodShiftSchedule: MotherhoodShiftScheduleModel;

    constructor(
      private route: ActivatedRoute,
      private cdr: ChangeDetectorRef,
      protected alertService: AlertService,
      public motherhoodSchedulerService: MotherhoodSchedulerService,
      public adminTokenService: AdminTokenService,
    ){}

    ngOnInit(): void {

      this.currentSquadron = this.route.snapshot.paramMap.get('squadron');
      this.currentShift = this.route.snapshot.paramMap.get('shift');

      this.motherhoodSchedulerService.setFilters(this.currentSquadron, this.currentShift, this.shiftDate);
      this._motherhoodShiftScheduleSubscription = this.motherhoodSchedulerService.motherhoodShiftSchedule$.subscribe(data => {
        this.motherhoodShiftSchedule = data;
      });

      this.adminTokenService.getAdminTokens(this.currentSquadron, true).subscribe(data => {
        this.adminTokens = data;
        if (this.adminTokens.length == 0) {
          // If the squadron does not have any active tokens, implied that anyone can edit.
          this.hasEditPermissions = true;
          this.editModeToggleDisabled = false;
        }
      });

      this._isLoadingSubscription = this.motherhoodSchedulerService.isLoading$.subscribe(data => {
        this.isLoading = data;
      });

    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes.shiftDate && changes.shiftDate.currentValue) {
        this.motherhoodSchedulerService.setFilters(this.currentSquadron, this.currentShift, this.shiftDate);
      }
    }

    ngAfterViewInit() {
      let storedTheme: string = localStorage.getItem('isDarkMode');
      if (storedTheme && JSON.parse(storedTheme) && this.darkModeToggleSwitch) {
        this.darkModeToggleSwitch.checked = true;
        this.darkModeSwitched.emit(true);
        this.cdr.detectChanges();
      }
      
      let accessLevel: string = sessionStorage.getItem('accessLevel');
      if (accessLevel) {
        this.hasEditPermissions = true;
        this.editModeToggleDisabled = false;
        this.cdr.detectChanges();

        //localStorage.clear();
      }
      
    }

    ngOnDestroy() {
      this._motherhoodShiftScheduleSubscription.unsubscribe();
      this._isLoadingSubscription.unsubscribe();
    }

    allowClear() {
      return (this.editMode && (this.motherhoodShiftSchedule?.line_instances?.length > 0));
    }

    toggleEditMode(enabled: boolean) {
      this.editMode = enabled;
      this.toggleEditModeEvent.emit(this.editMode);
    }

    load(event: any) {
      this.motherhoodSchedulerService.load();
      event.target.blur();
    }

    create(event: any) {
      this.motherhoodSchedulerService.create();
      event.target.blur();
    }

    clear(event: any) {
      this.motherhoodSchedulerService.clear();
      this.clearMotherhoodEvent.emit(true);
      event.target.blur();
    }

    publish(event: any) {
      this.publishMotherhoodEvent.emit(true);
      event.target.blur();
    }

    delete(event: any) {
      this.deleteMotherhoodEvent.emit(true);
      event.target.blur();
    }

    onDarkModeSwitched({ checked }: MatSlideToggleChange) {
      this.darkModeSwitched.emit(checked);
      localStorage.setItem('isDarkMode', checked.toString());
    }

    checkForEditPermissions() {
      if (this.hasEditPermissions) {
        this.hasEditPermissions = true;
        this.editModeToggleDisabled = false;

      } else {
        this.showTokenInput = true;
        setTimeout(() => this.adminTokenInput.nativeElement.focus(), 0);
        
      }
    }

    checkIfValidTokenCode(code: string) {
      if (this.editModeToggleSwitch.checked || this.hasEditPermissions) {
        return;
      }

      let validToken: AdminTokenModel = this.adminTokens.find(adminToken => adminToken.code == code);
      if (validToken) {
        this.hasEditPermissions = true;
        this.editModeToggleDisabled = false;

        this.editModeToggleSwitch.toggle();
        this.editModeToggleSwitch.focus();

        this.showTokenInput = false;

        this.toggleEditMode(true);

        sessionStorage.setItem('accessLevel', validToken.access_level);
        this.alertService.info("Permissions to edit granted. Token saved.", { 'autoClose': true });
      }
    }

}