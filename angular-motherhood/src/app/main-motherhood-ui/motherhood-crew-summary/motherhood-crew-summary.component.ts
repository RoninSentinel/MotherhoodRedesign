import { Component, Input,  EventEmitter, Output } from '@angular/core';
import { CrewMemberModel, CrewMemberShiftLineTimeBlocksModel, FlightOrdersModel, LineInstanceModel, LineTemplateModel } from 'src/app/model-types';
import { contrastingColor } from 'src/app/helpers/contrast-color.helper';
import { hexToRgb } from 'src/app/helpers/hex-to-rgb.helper';

import { AlertService } from 'src/app/shared/components/alert-notifications';

interface ICrewMemberScheduledBlock {
  crewMember: CrewMemberModel;
  crewMemberShiftLineTimeBlocks: CrewMemberShiftLineTimeBlocksModel[];
}

@Component({
  selector: 'motherhood-crew-summary',
  templateUrl: 'motherhood-crew-summary.component.html',
  styleUrls: ['./motherhood-crew-summary.component.css'],
})
export class MotherhoodCrewSummaryComponent {

    @Output() scheduleConflictEvent = new EventEmitter<CrewMemberShiftLineTimeBlocksModel[]>();

    @Input() editMode: boolean;
    @Input() callSignPreference: boolean;

    currentTimeIndex: number;
    scheduledCrewMemberShiftLineTimeBlocks: CrewMemberShiftLineTimeBlocksModel[] = [];
    conflictedTimeBlocks: CrewMemberShiftLineTimeBlocksModel[] = [];
    crewMembersWithConflicts: CrewMemberModel[] = [];
    crewMemberScheduledBlocks: ICrewMemberScheduledBlock[] = [];

    constructor(
      protected alertService: AlertService,
    ){}

    generateSummaryLines(lineInstances: LineInstanceModel[], flightOrders: FlightOrdersModel[]) {
      if (lineInstances) {
        this.scheduledCrewMemberShiftLineTimeBlocks = [];
        this.conflictedTimeBlocks = [];
        this.crewMemberScheduledBlocks = [];

        let totalCrewMembersWithConflicts: number = this.crewMembersWithConflicts.length;

        // Filter out all the unscheduled time blocks.  Hopefully helps optimize in the template.
        lineInstances.forEach(lineInstance => {
          lineInstance.shift_line_time_blocks.forEach(shiftLineTimeBlock => {
            shiftLineTimeBlock.crew_member_shift_line_time_blocks.forEach(crewMemberShiftLineTimeBlock => {
              if (crewMemberShiftLineTimeBlock.crew_member) {
                crewMemberShiftLineTimeBlock.line_template_color = lineInstance.line_template?.color;
                crewMemberShiftLineTimeBlock.line_template_name = lineInstance.line_template?.name;
                this.scheduledCrewMemberShiftLineTimeBlocks.push(crewMemberShiftLineTimeBlock);
              }
            });
          });
        });

        // Separate the time blocks based on crew member.
        flightOrders.forEach((flightOrder, index) => {

          if (flightOrder.total_hours_scheduled > 0) {

            let size: number = lineInstances[0].shift_line_time_blocks.length;
            let timeBlocks: CrewMemberShiftLineTimeBlocksModel[] = Array(size);
            let crewMember: CrewMemberModel;
            let conflictingTimeBlocks: CrewMemberShiftLineTimeBlocksModel[] = [];
            
            this.scheduledCrewMemberShiftLineTimeBlocks.forEach(scheduledTimeBlock => {
              if (flightOrder.crew_member_id == scheduledTimeBlock.crew_member.id) {
                crewMember = scheduledTimeBlock.crew_member;  // Saving same value repeatedly acceptable - allows easier code logic.
                if (timeBlocks[scheduledTimeBlock.shift_line_time_block_position] != undefined) {
                  // Conflict exists (crew member scheduled for more than one line at that time - not necessarily an error [i.e. MCC-B]).
                  conflictingTimeBlocks.push(scheduledTimeBlock);
                  this.conflictedTimeBlocks.push(scheduledTimeBlock);
                  this.crewMembersWithConflicts = this.crewMembersWithConflicts.filter(crewMember => crewMember != scheduledTimeBlock.crew_member).concat([scheduledTimeBlock.crew_member]);
                  
                } else {
                  timeBlocks[scheduledTimeBlock.shift_line_time_block_position] = scheduledTimeBlock;

                }
                
              }
            });
  
            // All scheduled time blocks for the crew member on flight orders have been found.
            this.crewMemberScheduledBlocks.push({crewMember: crewMember, 
                                                 crewMemberShiftLineTimeBlocks: timeBlocks});

            if (conflictingTimeBlocks.length > 0) {
              if (this.editMode && (totalCrewMembersWithConflicts < this.crewMembersWithConflicts.length)) {
                // Only interested in broadcasting message if the total has increased and actively being edited.
                this.alertService.info("Potential scheduling conflict.  Crew member will be listed multiple times in summary at bottom of schedule.", { 'autoClose': true });
              }
              
              this.generateCrewMemberScheduledBlocksFromConflicts(size, crewMember, conflictingTimeBlocks);

              
            }
          }
        });

        if (this.conflictedTimeBlocks.length > 0) {
          this.scheduleConflictEvent.emit(this.conflictedTimeBlocks);
        }
  
      }

    }

    generateCrewMemberScheduledBlocksFromConflicts(totalBlocksPerLine: number, crewMember: CrewMemberModel, conflictingTimeBlocks: CrewMemberShiftLineTimeBlocksModel[]) {
      let timeBlocks: CrewMemberShiftLineTimeBlocksModel[] = Array(totalBlocksPerLine);
      let remainingConflicts: CrewMemberShiftLineTimeBlocksModel[] = [];
      
      conflictingTimeBlocks.forEach(scheduledTimeBlock => {
          if (timeBlocks[scheduledTimeBlock.shift_line_time_block_position] != undefined) {
            // Conflict exists (crew member scheduled for more than one line at that time - not necessarily an error [i.e. MCC-B]).
            remainingConflicts.push(scheduledTimeBlock);
            
          } else {
            timeBlocks[scheduledTimeBlock.shift_line_time_block_position] = scheduledTimeBlock;

          }
      });

      // All scheduled time blocks for the crew member on flight orders have been found.
      this.crewMemberScheduledBlocks.push({crewMember: crewMember, 
                                           crewMemberShiftLineTimeBlocks: timeBlocks});

      if (remainingConflicts.length > 0) {
        this.generateCrewMemberScheduledBlocksFromConflicts(totalBlocksPerLine, crewMember, remainingConflicts);
      }
    }

    getPreferredTextColor(backgroundColor: string): string {
        if (!backgroundColor) {
          return "inherit";
        }

        let currentColor = hexToRgb(backgroundColor);
        return (contrastingColor(currentColor));
    }

    updateCurrentTimeIndex(timeIndex: number) {
      this.currentTimeIndex = timeIndex;

    }

    getLastNameForScheduledBlock(scheduledBlock: ICrewMemberScheduledBlock) : string {
      // Returns the call sign, if that is preferred instead of last name, if it exists (if in read mode).
      if (this.callSignPreference && scheduledBlock.crewMember?.call_sign && !this.editMode) {
        return scheduledBlock.crewMember.call_sign;

      } else {
        return scheduledBlock.crewMember?.last_name;

      }

    }

}