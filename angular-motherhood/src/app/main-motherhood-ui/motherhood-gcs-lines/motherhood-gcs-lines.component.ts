import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChildren, QueryList, EventEmitter, Output, ChangeDetectorRef, NgZone, Renderer2, ElementRef, AfterViewInit, Inject, AfterViewChecked } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BlockCategoryModel, CrewMemberShiftLineTimeBlocksModel, FlightOrdersModel, LineInstanceModel, MotherhoodShiftScheduleModel, ShiftLineTimeBlockModel } from 'src/app/model-types';
import { contrastingColor } from 'src/app/helpers/contrast-color.helper';
import { hexToRgb } from 'src/app/helpers/hex-to-rgb.helper';
import { SelectContainerComponent } from 'ngx-drag-to-select';
import { AlertService } from 'src/app/shared/components/alert-notifications';
import { MotherhoodSchedulerService } from 'src/app/services/motherhood-scheduler.service';
import { FlightOrderService } from 'src/app/services/flight-order.service';
import { LineTemplateService } from 'src/app/services/line-template.service';

@Component({
  selector: 'motherhood-gcs-lines',
  templateUrl: 'motherhood-gcs-lines.component.html',
  styleUrls: ['./motherhood-gcs-lines.component.css'],
})
export class MotherhoodGCSLinesComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {

    @Input() selectedBlockCategory: BlockCategoryModel;
    @Input() editMode: boolean;
    @Input() callSignPreference: boolean;

    @Output() lineRemovedFromScheduleEvent = new EventEmitter<LineInstanceModel>();

    @ViewChildren(SelectContainerComponent) selectContainerComponentChildren: QueryList<SelectContainerComponent>;
    @ViewChildren('note') noteInputFieldChildren: QueryList<any>;
    @ViewChildren('crewName') crewNameFieldChildren: QueryList<any>;

    currentSquadron: string;
    currentShift: string;
    currentTimeIndex: number;
    flightOrders: FlightOrdersModel[] = [];
    motherhoodShiftSchedule: MotherhoodShiftScheduleModel;

    private _motherhoodShiftScheduleSubscription;
    private _flightOrderSubscription;
    private _isLoadingSubscription;

    isLoading = false;
    SPECIAL_TERMINATION_CHAR = 'x';

    selectedCrewMemberShiftLineTimeBlocks: CrewMemberShiftLineTimeBlocksModel[] = []

    constructor(
      private route: ActivatedRoute,
      protected alertService: AlertService,
      public motherhoodSchedulerService: MotherhoodSchedulerService,
      public flightOrderService: FlightOrderService,
      public lineTemplateService: LineTemplateService,
    ){}

    ngOnInit(): void {
      this.currentSquadron = this.route.snapshot.paramMap.get('squadron');
      this.currentShift = this.route.snapshot.paramMap.get('shift');

      this._motherhoodShiftScheduleSubscription = this.motherhoodSchedulerService.motherhoodShiftSchedule$.subscribe(data => {
        this.motherhoodShiftSchedule = data;
      })

      this._flightOrderSubscription = this.flightOrderService.flightOrders$.subscribe(data => {
        this.flightOrders = data;
      });

      this._isLoadingSubscription = this.motherhoodSchedulerService.isLoading$.subscribe(data => {
        this.isLoading = data;
      });
  
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes.selectedBlockCategory) {
        this.updateColorForSelectedBlocks();
      }

      if (changes.editMode) {
          this.selectContainerComponentChildren?.forEach(child => {
            child.clearSelection();
          });
      }

    }

    ngAfterViewInit() {

    }

    ngAfterViewChecked() {
      this.selectContainerComponentChildren?.forEach(child => {
        // Does not seem to properly refresh if called via OnChanges or AfterViewInit.
        child.update();
      });
    }

    ngOnDestroy() {
      this._motherhoodShiftScheduleSubscription.unsubscribe();
      this._flightOrderSubscription.unsubscribe();
      this._isLoadingSubscription.unsubscribe();
    }

    updateColorForSelectedBlocks() {
      this.motherhoodSchedulerService.updateColorForSelectedBlocks(this.selectedCrewMemberShiftLineTimeBlocks, this.selectedBlockCategory);
 
      this.selectContainerComponentChildren?.forEach(child => {
        child.clearSelection();
      });

      this.selectedCrewMemberShiftLineTimeBlocks = [];
      this.selectedBlockCategory = null;
    }

    getPreferredTextColor(backgroundColor: string): string {
        if (backgroundColor) {
          let currentColor = hexToRgb(backgroundColor);
          return (contrastingColor(currentColor));

        } else {
          return "inherit";

        }

    }

    onNotesChange(notes: string, shiftLineTimeBlock: ShiftLineTimeBlockModel) {
      shiftLineTimeBlock.notes = notes?.trim();
    
    }

    onCrewMemberChange(crewName: string, crewMemberShiftLineTimeBlockID: number, lineInstanceIndex: number, shiftLineTimeBlockIndex: number, crewMemberShiftLineTimeBlocksIndex: number) {
      crewName = crewName.trim();
      let validFlightOrder: FlightOrdersModel = this.findFlightOrderForName(crewName);
      this.motherhoodSchedulerService.addCrewMemberToSchedule(crewName, validFlightOrder, crewMemberShiftLineTimeBlockID, lineInstanceIndex, shiftLineTimeBlockIndex, crewMemberShiftLineTimeBlocksIndex);
      
    }

    onSelectCrewMemberShiftLineTimeBlock(crewMemberShiftLineTimeBlock: CrewMemberShiftLineTimeBlocksModel) {
      if (crewMemberShiftLineTimeBlock) {
        this.selectedCrewMemberShiftLineTimeBlocks.push(crewMemberShiftLineTimeBlock);
      }

    }

    findFlightOrderForName(searchName: string) : FlightOrdersModel {
      searchName = searchName?.toLowerCase();

      if (!searchName || searchName === this.SPECIAL_TERMINATION_CHAR) {
        return undefined;
      }

      let matchedFlightOrder: FlightOrdersModel;
      if (this.flightOrders) {
        // Priority of search:  Last name > Call sign > Crew member ID.

        // Attempt to match based on last name.
        matchedFlightOrder = this.flightOrders.find(flightOrder => flightOrder.crew_member.last_name.toLowerCase() == searchName);

        // Attempt to match based on call sign.
        if (!matchedFlightOrder) {
          matchedFlightOrder = this.flightOrders.find(flightOrder => flightOrder.crew_member.call_sign?.toLowerCase() == searchName);

        }

        // Attempt to match based on ID.
        if (!matchedFlightOrder) {
          // Convert string to number for search to work.
          matchedFlightOrder = this.flightOrders.find(flightOrder => flightOrder.crew_member_id == +searchName);

        }

        // No matches - notify scheduler.
        if (!matchedFlightOrder) {
          this.alertService.error("Value entered missing from crew flight orders: '" + searchName + "'. Add crew member to flight orders before attempting to schedule on a line.");
        }

      }
      
      return matchedFlightOrder;

    }

    nullOrSpecialChar(crewName: string): string | null {

      crewName = crewName.trim().toLowerCase();
      return (crewName == this.SPECIAL_TERMINATION_CHAR) ? this.SPECIAL_TERMINATION_CHAR : null;

    }

    toggleLineVisibility(lineInstance: LineInstanceModel) {
      lineInstance.line_template.is_hidden_in_read_mode = +!lineInstance.line_template.is_hidden_in_read_mode;
      this.lineTemplateService.updateLineTemplate(lineInstance.line_template.id,
                                                  lineInstance.line_template.name,
                                                  lineInstance.line_template.line_type_id,
                                                  lineInstance.line_template.color,
                                                  !!lineInstance.line_template.is_active,
                                                  lineInstance.line_template.order_preference,
                                                  lineInstance.line_template.call_sign,
                                                  lineInstance.line_template.squadron_id,
                                                  lineInstance.line_template.aor_id,
                                                  !!lineInstance.line_template.is_hidden_in_read_mode,
                                                  lineInstance.line_template.extra_field_name).subscribe(data => {
                                                    // No further processing required.
                                                  });
    }

    removeLineInstanceFromSchedule(lineInstance) {
      this.motherhoodSchedulerService.removeLineInstanceFromSchedule(lineInstance);
      this.lineRemovedFromScheduleEvent.emit(lineInstance);
    }

    clearInputFields() {
      this.crewNameFieldChildren.forEach(inputField => {
        inputField.nativeElement.value = "";
      });

      this.noteInputFieldChildren.forEach(inputField => {
        inputField.nativeElement.value = "";
      });
    }

    addCrewMemberToSelectedBlocksFromFlightOrder(flightOrder: FlightOrdersModel) {
      if (this.selectedCrewMemberShiftLineTimeBlocks) {
        // Call service to process the population of blocks.
        

        this.selectContainerComponentChildren?.forEach(child => {
          child.clearSelection();
        });
  
        this.selectedCrewMemberShiftLineTimeBlocks = [];
      }
    }

    isRowEmpty(lineInstance: LineInstanceModel, row: number): boolean {
      // Row should be 0-indexed.
      let isEmpty: boolean = true;
      lineInstance?.shift_line_time_blocks.forEach(shiftLineTimeBlock => {
        shiftLineTimeBlock?.crew_member_shift_line_time_blocks.forEach(timeBlock => {
          if ((timeBlock.position == row) && (timeBlock.crew_member)) {
            isEmpty = false;
            return isEmpty;
          }
        });
      });

      return isEmpty;
    }

    isNotesEmpty(lineInstance: LineInstanceModel): boolean {
      // Notes are treated differently than other time blocks processed via isRowEmpty().
      let isEmpty: boolean = true;
      lineInstance?.shift_line_time_blocks.forEach(timeBlock => {
        if (timeBlock.notes?.trim().length > 0) {
          isEmpty = false;
          return isEmpty;
        }
      });

      return isEmpty;
    }

    getLastNameForBlock(crewMemberShiftLineTimeBlock: CrewMemberShiftLineTimeBlocksModel) : string {
      // Returns the call sign, if that is preferred instead of last name, if it exists (if in read mode).
      if (this.callSignPreference && crewMemberShiftLineTimeBlock.crew_member?.call_sign && !this.editMode) {
        return crewMemberShiftLineTimeBlock.crew_member.call_sign;

      } else {
        return crewMemberShiftLineTimeBlock.crew_member?.last_name;

      }

    }

    updateCurrentTimeIndex(timeIndex: number) {
      this.currentTimeIndex = timeIndex;

    }

}