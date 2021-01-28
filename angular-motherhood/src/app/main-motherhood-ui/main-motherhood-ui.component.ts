import { DOCUMENT } from '@angular/common';
import { Component, OnInit, ViewChild, Inject, Renderer2, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockCategoryModel, CrewMemberModel, CrewMemberShiftLineTimeBlocksModel, FlightOrdersModel, LineInstanceModel, MotherhoodShiftScheduleModel } from '../model-types';
import { MotherhoodSchedulerService } from '../services/motherhood-scheduler.service';
import { WebsocketService } from '../services/websocket.service';
import { MotherhoodAddLineComponent } from './motherhood-add-line/motherhood-add-line.component';
import { MotherhoodCrewSummaryComponent } from './motherhood-crew-summary/motherhood-crew-summary.component';
import { MotherhoodDatetimeBannerComponent } from './motherhood-datetime-banner/motherhood-datetime-banner.component';
import { MotherhoodFlightOrdersComponent } from './motherhood-flight-orders/motherhood-flight-orders.component';
import { MotherhoodGCSLinesComponent } from './motherhood-gcs-lines/motherhood-gcs-lines.component';


@Component({
  selector: 'main-motherhood-ui',
  templateUrl: './main-motherhood-ui.component.html',
  styleUrls: ['./main-motherhood-ui.component.css']
})
export class MainMotherhoodUiComponent implements OnInit {

    @ViewChild(MotherhoodGCSLinesComponent) motherhoodGCSLinesComponent: MotherhoodGCSLinesComponent;
    @ViewChild(MotherhoodAddLineComponent) motherhoodAddLineComponent: MotherhoodAddLineComponent;
    @ViewChild(MotherhoodFlightOrdersComponent) motherhoodFlightOrdersComponent: MotherhoodFlightOrdersComponent;
    @ViewChild(MotherhoodCrewSummaryComponent) motherhoodCrewSummaryComponent: MotherhoodCrewSummaryComponent;
    @ViewChild(MotherhoodDatetimeBannerComponent) motherhoodDatetimeBannerComponent: MotherhoodDatetimeBannerComponent;
    
    shiftDate: Date;
    currentTime: Date;
    currentSquadron: string;
    currentShift: string;
    currentTimeIndex: number = -1;
    firstLine: LineInstanceModel;
    editMode: boolean = false;

    motherhoodShiftSchedule: MotherhoodShiftScheduleModel;
    private _motherhoodShiftScheduleSubscription;

    currentFlightOrders: FlightOrdersModel[] = [];
    selectedBlockCategory: BlockCategoryModel;
    crewMemberToAddToFlightOrders: CrewMemberModel;

    constructor(
      @Inject(DOCUMENT) private document: Document,
      private renderer: Renderer2,
      private router: Router,
      private route: ActivatedRoute,
      private cdr: ChangeDetectorRef,
      public motherhoodSchedulerService: MotherhoodSchedulerService,
      private websocketService: WebsocketService,
    ){}

    ngOnInit(): void {
      this.currentSquadron = this.route.snapshot.paramMap.get('squadron');
      this.currentShift = this.route.snapshot.paramMap.get('shift');

      this._motherhoodShiftScheduleSubscription = this.motherhoodSchedulerService.motherhoodShiftSchedule$.subscribe(data => {
        this.motherhoodShiftSchedule = data;
        if (this.motherhoodShiftSchedule && this.motherhoodShiftSchedule?.line_instances[0]) {

          setTimeout(() => {
            // By ensuring value exists, avoid JSON parsing errors.
            if (this.motherhoodShiftSchedule?.line_instances[0]) {
              this.firstLine = JSON.parse(JSON.stringify(this.motherhoodShiftSchedule?.line_instances[0]));  // Force a "deep copy" to trigger change detection.
              //https://stackoverflow.com/questions/34364880/expression-has-changed-after-it-was-checked
              this.cdr.detectChanges();
            }
          });

        }
        
      });

    }

    ngOnDestroy() {
      this._motherhoodShiftScheduleSubscription?.unsubscribe();
    }

    updateBlockCategorySelected(selectedBlockCategory: BlockCategoryModel) {
      // Create a new object to force change detection.
      if (selectedBlockCategory) {
        this.selectedBlockCategory = new BlockCategoryModel(selectedBlockCategory.id, 
                                                            selectedBlockCategory.name, 
                                                            selectedBlockCategory.short_name, 
                                                            selectedBlockCategory.color, 
                                                            selectedBlockCategory.is_active, 
                                                            selectedBlockCategory.squadron_id);
      } else {
        //this.selectedBlockCategory = null;  // Will not trigger twice in a row.
        this.selectedBlockCategory = new BlockCategoryModel(0, '', '', null, +false, this.currentSquadron);
      }

    }

    publishMotherhood(publish: boolean) {
      this.motherhoodSchedulerService.publish();
    }

    updateMotherhoodDate(newDate: Date) {
      this.shiftDate = newDate;
      this.motherhoodShiftSchedule = null;  // Clear the current schedule on date change until it can be re-loaded.
    }

    updateMotherhoodCurrentTime(newDate: Date) {
      this.currentTime = newDate;
    }

    updateTimeIndex(timeIndex: number) {
      this.currentTimeIndex = timeIndex;
      this.motherhoodGCSLinesComponent?.updateCurrentTimeIndex(this.currentTimeIndex);
      this.motherhoodDatetimeBannerComponent?.updateCurrentTimeIndex(this.currentTimeIndex);
      this.motherhoodCrewSummaryComponent?.updateCurrentTimeIndex(this.currentTimeIndex);
    }

    refreshMotherhood(newMotherhoodShiftSchedule: MotherhoodShiftScheduleModel) {
      this.motherhoodShiftSchedule = newMotherhoodShiftSchedule;
    }

    addCrewMemberToFlightOrders(crewMemberToAddToFlightOrders: CrewMemberModel) {
      this.crewMemberToAddToFlightOrders = crewMemberToAddToFlightOrders;
    }

    updateFlightOrders(flightOrders: FlightOrdersModel[]) {
      this.currentFlightOrders = flightOrders;

      this.motherhoodCrewSummaryComponent?.generateSummaryLines(this.motherhoodShiftSchedule?.line_instances, this.currentFlightOrders);
    }

    updateCallSignPreference(isCallSignPreferred: boolean) {
      this.motherhoodGCSLinesComponent.callSignPreference = isCallSignPreferred;
      
      this.motherhoodCrewSummaryComponent.callSignPreference = isCallSignPreferred;

      this.motherhoodDatetimeBannerComponent.callSignPreference = isCallSignPreferred;
      this.motherhoodDatetimeBannerComponent.updateMCCs();
    }

    refreshEditModeStatus(editModeEnabled: boolean) {
      this.editMode = editModeEnabled;
      this.motherhoodSchedulerService.editMode = this.editMode;

      if (this.editMode) {
        this.websocketService.generateMessageToBroadcast("EditModeEnabled", "Edit mode has been enabled by another user.");
      } else {
        this.websocketService.generateMessageToBroadcast("EditModeDisabled", "Edit mode has been disabled by another user.");
      }
    }

    clearMotherhoodSchedule(clearSchedule: boolean) {
      this.motherhoodGCSLinesComponent.clearInputFields();
      this.motherhoodDatetimeBannerComponent.clearMCCs();
    }

    deleteMotherhoodSchedule(deleteSchedule: boolean) {
      this.motherhoodSchedulerService.delete();
      this.motherhoodDatetimeBannerComponent.clearMCCs();
    }

    addCrewMemberToSelectedBlocksFromFlightOrder(flightOrder: FlightOrdersModel) {
      this.motherhoodGCSLinesComponent.addCrewMemberToSelectedBlocksFromFlightOrder(flightOrder);
    }

    updateEligibleLinesForSchedule(lineInstance: LineInstanceModel) {
      this.motherhoodAddLineComponent.addLineToOptions(lineInstance);
    }

    switchTheme(isDarkMode: boolean) {
      // https://www.youtube.com/watch?v=sM3ATKt8568
      const activeTheme = isDarkMode ? 'theme-dark' : 'theme-light';
      const inactiveTheme = !isDarkMode ? 'theme-dark': 'theme-light';
      //this.renderer.setAttribute(this.document.body, 'class', hostClass);
      this.renderer.addClass(this.document.body, activeTheme);
      this.renderer.removeClass(this.document.body, inactiveTheme);
    }

    updateHoursBasedOnConflicts(conflictingBlocks: CrewMemberShiftLineTimeBlocksModel[]) {
      this.motherhoodFlightOrdersComponent.calculateTotalHoursScheduled(conflictingBlocks);
    }

    navigateMenu(tag) {
      if (tag === 'settings') {
        this.router.navigate(['motherhood/' + this.currentSquadron + '/settings']);
      }
    }

}