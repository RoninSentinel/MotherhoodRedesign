import { Injectable } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import { BlockCategoryModel, CrewMemberModel, CrewMemberShiftLineTimeBlocksModel, FlightOrdersModel, LineInstanceModel, LineTemplateModel, MotherhoodShiftScheduleModel, ShiftLineTimeBlockModel, ShiftTemplateInstanceModel, ShiftTemplateModel } from '../model-types';
import { CrewMemberShiftLineTimeBlockService } from './crew-member-shift-line-time-block.service';
import { LineInstanceService } from './line-instance.service';
import { LineTemplateService } from './line-template.service';
import { ShiftLineTimeBlockService } from './shift-line-time-block.service';
import { ShiftTemplateInstanceService } from './shift-template-instance.service';
import { ShiftTemplateService } from './shift-template.service';
import { AlertService } from 'src/app/shared/components/alert-notifications';
import { FlightOrderService } from './flight-order.service';
import { v4 as uuidv4 } from 'uuid';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MotherhoodSchedulerService {

  private motherhoodShiftSchedule: MotherhoodShiftScheduleModel;
  private motherhoodShiftScheduleChange: Subject<MotherhoodShiftScheduleModel> = new Subject<MotherhoodShiftScheduleModel>();
  motherhoodShiftSchedule$: Observable<MotherhoodShiftScheduleModel> = this.motherhoodShiftScheduleChange.asObservable();

  private isLoading: boolean;
  private isLoadingChange: Subject<boolean> = new Subject<boolean>();
  isLoading$: Observable<boolean> = this.isLoadingChange.asObservable();

  SPECIAL_TERMINATION_CHAR = 'x';

  private _squadronFilter: string;
  private _shiftFilter: string;
  private _dateFilter: Date;
  private _uuid;

  editMode: boolean;

  constructor(
    private datePipe: DatePipe,
    protected alertService: AlertService,
    public shiftTemplateService: ShiftTemplateService,
    public lineTemplateService: LineTemplateService,
    public shiftTemplateInstanceService: ShiftTemplateInstanceService,
    public lineInstanceService: LineInstanceService,
    public shiftLineTimeBlockService: ShiftLineTimeBlockService,
    public crewMemberShiftLineTimeBlockService: CrewMemberShiftLineTimeBlockService,
    public flightOrderService: FlightOrderService,
  ) {
    this._uuid = uuidv4();
   }

  setSquadronFilter(squadronID: string) {
    this._squadronFilter = squadronID;
    this.setFilters(this._squadronFilter, this._shiftFilter, this._dateFilter);
  }

  setShiftFilter(shift: string) {
    this._shiftFilter = shift;
    this.setFilters(this._squadronFilter, this._shiftFilter, this._dateFilter);
  }

  setDateFilter(date: Date) {
    this._dateFilter = date;
    this.setFilters(this._squadronFilter, this._shiftFilter, this._dateFilter);
  }

  setFilters(squadronID: string, shift: string, date: Date) {
    this._squadronFilter = squadronID;
    this._shiftFilter = shift;
    this._dateFilter = date;

    if (this._squadronFilter && this._shiftFilter && this._dateFilter) {
      this.load();
    }
  }

  getCurrentDate() {
    return this._dateFilter;
  }

  getCurrentShift() {
    return this._shiftFilter;
  }

  getCurrentSquadron() {
    return this._squadronFilter;
  }

  getUUID() {
    return this._uuid;
  }

  load() {
    this.isLoading = true;
    this.isLoadingChange.next(this.isLoading);

    this.shiftTemplateService.getShiftTemplates(this._squadronFilter, this._shiftFilter, true).subscribe(data => {
      let shiftTemplates: ShiftTemplateModel[] = data;

      if (shiftTemplates.length == 0) {
        this.alertService.error("No active shift templates found.  Ensure one is set to active for this shift.");
        this.isLoading = false;
        this.isLoadingChange.next(this.isLoading);
        return;

      } else if (shiftTemplates.length > 1) {
        this.alertService.error("Multiple active shift templates found.  Ensure only one is set to active for this shift.");
        this.isLoading = false;
        this.isLoadingChange.next(this.isLoading);
        return;

      }

      this.shiftTemplateInstanceService.getShiftTemplateInstances(this._dateFilter, shiftTemplates[0].id).subscribe(data => {
        let shiftTemplateInstances: ShiftTemplateInstanceModel[] = data;

        this.loadWithShiftTemplateInstance(shiftTemplateInstances[0]);

        this.isLoading = false;
        this.isLoadingChange.next(this.isLoading);

        //console.log(this.motherhoodShiftSchedule);

      })

    });

  }

  loadWithShiftTemplateInstance(shiftTemplateInstance: ShiftTemplateInstanceModel) {
    if (!shiftTemplateInstance) {
      // No need to go further - user needs to create a "new" motherhood schedule for current date.
      this.motherhoodShiftSchedule = null;
      this.motherhoodShiftScheduleChange.next(this.motherhoodShiftSchedule);

      this.isLoading = false;
      this.isLoadingChange.next(this.isLoading);
      return;
    }

    let shiftTemplate: ShiftTemplateModel = shiftTemplateInstance.shift_template;
    let lineInstances: LineInstanceModel[] = shiftTemplateInstance.line_instances;
    lineInstances = lineInstances.sort((a,b) => 0 - (a.line_template?.order_preference > b.line_template?.order_preference ? -1 : 1));

    // Populate values not set via the API.
    lineInstances.forEach(lineInstance => {
      lineInstance.shift_line_time_blocks.forEach(shiftLineTimeBlock => {
        shiftLineTimeBlock.crew_member_shift_line_time_blocks.forEach(timeBlock => {
          timeBlock.shift_line_time_block_position = shiftLineTimeBlock.position;
        });
      });
    });

    this.flightOrderService.getFlightOrders(this._dateFilter, shiftTemplateInstance.id);
    this.motherhoodShiftSchedule = new MotherhoodShiftScheduleModel(shiftTemplate, shiftTemplateInstance, lineInstances);
    this.motherhoodShiftScheduleChange.next(this.motherhoodShiftSchedule);
  }

  loadWithBlocks(crewMemberShiftLineTimeBlocks: CrewMemberShiftLineTimeBlocksModel[]) {

  }

  create() {
    // Assumes it has been determined safe to create the motherhood from scratch for currentDate.
    let activeShiftTemplate: ShiftTemplateModel;
    let activeLineTemplates: LineTemplateModel[];
    let currentShiftTemplateInstance: ShiftTemplateInstanceModel;
    let currentLineInstances: LineInstanceModel[];
    let currentShiftLineTimeBlocks: ShiftLineTimeBlockModel[];
    let currentCrewMemberShiftLineTimeBlocks: CrewMemberShiftLineTimeBlocksModel[];

    this.isLoading = true;
    this.isLoadingChange.next(this.isLoading);

    let shiftTemplates$ = this.shiftTemplateService.getShiftTemplates(this._squadronFilter, this._shiftFilter, true);
    let lineTemplates$ = this.lineTemplateService.getLineTemplates(this._squadronFilter);

    forkJoin([shiftTemplates$, lineTemplates$]).subscribe(results => {
      // Assumes only one active shift template at a time.
      activeShiftTemplate = results[0].find(element => element.is_active == 1);
      activeLineTemplates = results[1].filter(element => element.is_active == 1);

      // Previously retrieved all active Shift Templates for currentSquadron and currentShift.  Should be limited to 1.
      // Previously retrieved all active line templates for currentSquadron.

      if (activeShiftTemplate && activeLineTemplates) {
        // Create shift template instance based on current date for shift template (should only be one active by shift name).
        this.shiftTemplateInstanceService.addShiftTemplateInstance(0, activeShiftTemplate.id, this._dateFilter).subscribe(data => {
          currentShiftTemplateInstance = data;

          let newLineInstances: LineInstanceModel[] = [];
          for (let lineTemplate of activeLineTemplates) {
            newLineInstances.push(new LineInstanceModel(0, lineTemplate.id, currentShiftTemplateInstance.id));
          }

          this.lineInstanceService.addLineInstances(newLineInstances).subscribe(data => {
            currentLineInstances = data;

            // Create shift line time blocks for each line instance.
            let newShiftLineTimeBlocks: ShiftLineTimeBlockModel[] = [];
            for (let lineInstance of currentLineInstances) {
              newShiftLineTimeBlocks = newShiftLineTimeBlocks.concat(this.shiftLineTimeBlockService.createShiftLineTimeBlocksForLineInstance(lineInstance.id, activeShiftTemplate.start_time, activeShiftTemplate.total_hours));
            }

            this.shiftLineTimeBlockService.addShiftLineTimeBlocks(newShiftLineTimeBlocks).subscribe(data => {
              currentShiftLineTimeBlocks = data;

              // Create (4) crew member shift line time blocks for every shift line time block (crew members blank).
              let newCrewMemberShiftLineTimeBlocks: CrewMemberShiftLineTimeBlocksModel[] = [];
              for (let shiftLineTimeBlock of currentShiftLineTimeBlocks) {
                newCrewMemberShiftLineTimeBlocks = newCrewMemberShiftLineTimeBlocks.concat(this.crewMemberShiftLineTimeBlockService.createGenericCrewMemberShiftLineTimeBlocksForShiftLineTimeBlock(shiftLineTimeBlock.id));
              }

              this.crewMemberShiftLineTimeBlockService.addCrewMemberShiftLineTimeBlocks(newCrewMemberShiftLineTimeBlocks).subscribe(data => {
                currentCrewMemberShiftLineTimeBlocks = data;
                
                this.load();
              });
            });
          });
          
        });

      } else {
        this.alertService.error("Unexpected error: Unable to retrieve active shift and/or line templates.  Contact 732 OSXP if the problem persists.");

        this.isLoading = false;
        this.isLoadingChange.next(this.isLoading);
      }

    });
  }

  publish() {
    this.flightOrderService.batchUpdateFlightOrders(this._uuid, this._dateFilter, this._squadronFilter, this._shiftFilter);

    let crewMemberShiftLineTimeBlocks: CrewMemberShiftLineTimeBlocksModel[] = [];
    let shiftLineTimeBlocks: ShiftLineTimeBlockModel[] = [];

    this.motherhoodShiftSchedule.line_instances.forEach(lineInstance => {
      lineInstance.shift_line_time_blocks.forEach(shiftLineTimeBlock => {
        shiftLineTimeBlocks.push(shiftLineTimeBlock);
        crewMemberShiftLineTimeBlocks = crewMemberShiftLineTimeBlocks.concat(shiftLineTimeBlock.crew_member_shift_line_time_blocks);
      });
    });

    this.shiftLineTimeBlockService.batchUpdateShiftLineTimeBlocks(shiftLineTimeBlocks).subscribe(data => {
      // Update last to ensure that distributed updates to other clients uses the latest information.
      this.crewMemberShiftLineTimeBlockService.batchUpdateCrewMemberShiftLineTimeBlocks(this._uuid, this._dateFilter, this._squadronFilter, this._shiftFilter, crewMemberShiftLineTimeBlocks).subscribe(data => {
        // No action necessary.  No new data should be returned after update (IDs, for example, should have already been created under current implementation).
      });
    });
  }

  clear() {
    this.motherhoodShiftSchedule.line_instances.forEach(lineInstance => {
      lineInstance.shift_line_time_blocks.forEach(shiftLineTimeBlock => {
        shiftLineTimeBlock.notes = null;
        shiftLineTimeBlock.block_category_id = null;
        shiftLineTimeBlock.block_category = null;

        shiftLineTimeBlock.crew_member_shift_line_time_blocks.forEach(timeBlock => {
          timeBlock.crew_member = null;

        });
      });
    });
    //this.motherhoodShiftSchedule = new MotherhoodShiftScheduleModel(shiftTemplate, shiftTemplateInstance, lineInstances);
    this.motherhoodShiftScheduleChange.next(this.motherhoodShiftSchedule);

  }

  delete() {
    // Delete flight orders, shift template instance, line instances, shift line blocks, crew member shift line time blocks for the current shift.
    
    this.flightOrderService.batchDeleteFlightOrders()?.subscribe(data => {
      // console.log("Deletion of flight orders complete.");
    });
    
    if (this.motherhoodShiftSchedule?.shift_template_instance) {
      this.shiftTemplateInstanceService.deleteShiftTemplateInstance(this.motherhoodShiftSchedule.shift_template_instance.id).subscribe(data => {
        let lineInstanceIDs: number[] = [];
        let shiftLineTimeBlockIDs: number[] = [];
        let crewMemberShiftLineTimeBlockIDs: number[] = [];
  
        this.motherhoodShiftSchedule.line_instances.forEach(lineInstance => {
          lineInstanceIDs.push(lineInstance.id);
          
          lineInstance.shift_line_time_blocks.forEach(shiftLineTimeBlock => {
            shiftLineTimeBlockIDs.push(shiftLineTimeBlock.id);
  
            shiftLineTimeBlock.crew_member_shift_line_time_blocks.forEach(timeBlock => {
              crewMemberShiftLineTimeBlockIDs.push(timeBlock.id);
            });
    
          });
        
        });
  
        this.lineInstanceService.batchDeleteLineInstances(lineInstanceIDs).subscribe(data => {
          // console.log("Deletion of line instances complete.");
        });
  
        this.shiftLineTimeBlockService.batchDeleteShiftLineTimeBlocks(shiftLineTimeBlockIDs).subscribe(data => {
          // console.log("Deletion of shift line time blocks complete.");
        });
  
        this.crewMemberShiftLineTimeBlockService.batchDeleteCrewMemberShiftLineTimeBlocks(crewMemberShiftLineTimeBlockIDs).subscribe(data => {
          // console.log("Deletion of crew member shift line time blocks complete.");
        });
  
        this.motherhoodShiftSchedule = null;
        this.motherhoodShiftScheduleChange.next(this.motherhoodShiftSchedule);
    
      });
    }

  }

  addCrewMemberToSchedule(crewName: string, validFlightOrder: FlightOrdersModel, crewMemberShiftLineTimeBlockID: number, lineInstanceIndex: number, shiftLineTimeBlockIndex: number, crewMemberShiftLineTimeBlocksIndex: number) {
    // Propagate the name to all time blocks on the same line in the future until the end of shift, if valid.
    // Valid name: Last name or call sign or ID is on any of the flight orders.  No enforcement of role, for flexibility.
    // Special case: x or X will be an override mark indicating stop propagation of name to additional blocks.

    let lineInstance: LineInstanceModel = this.motherhoodShiftSchedule.line_instances[lineInstanceIndex];
    let shiftLineTimeBlocks: ShiftLineTimeBlockModel[] = lineInstance.shift_line_time_blocks;
    let dirtyShiftLineTimeBlock: ShiftLineTimeBlockModel = shiftLineTimeBlocks[shiftLineTimeBlockIndex];
    let crewMemberShiftLineTimeBlocks: CrewMemberShiftLineTimeBlocksModel[] = dirtyShiftLineTimeBlock.crew_member_shift_line_time_blocks;
    let editedCrewMemberShiftLineTimeBlock: CrewMemberShiftLineTimeBlocksModel = crewMemberShiftLineTimeBlocks[crewMemberShiftLineTimeBlocksIndex];

    let crewNameEmpty: boolean = false;
    if (!crewName) {
      crewNameEmpty = true;
    }

    if (editedCrewMemberShiftLineTimeBlock.id == crewMemberShiftLineTimeBlockID) {
      // Sanity check passed ensuring that the expected block exists at the correct location.
      let purgeCrewMember: boolean = false

      if (crewName.toLowerCase() === this.SPECIAL_TERMINATION_CHAR) {
        purgeCrewMember = true;
      } else {
        // Special case: Crew member entered is already set to the block (or is invalid).  Stop processing, cell was left empty.
        if ((validFlightOrder?.crew_member_id == editedCrewMemberShiftLineTimeBlock.crew_member?.id) && !crewNameEmpty) {

          if (validFlightOrder) {
            this.alertService.info("Matching crew member is already scheduled for the time block on that line.", { 'autoClose': true });
          }

          return;
        }
      }

      if (validFlightOrder || purgeCrewMember || crewNameEmpty) {
        // Do not process names that do not correlate to valid flight orders.
        let crewMemberToReplace: CrewMemberModel = editedCrewMemberShiftLineTimeBlock.crew_member;

        if (purgeCrewMember) {
          // No crew member.
          editedCrewMemberShiftLineTimeBlock.crew_member_id = -1;  // This block contains the special termination char.
          editedCrewMemberShiftLineTimeBlock.crew_member = null;

        } else if (validFlightOrder) {
          // Replace the actively edited block with the crew member matching the flight orders.
          editedCrewMemberShiftLineTimeBlock.crew_member = validFlightOrder.crew_member;
          editedCrewMemberShiftLineTimeBlock.crew_member_id = validFlightOrder.crew_member?.id;

        } else {
          // Special case: No name was entered into the time block.
          // The crew member name was deleted OR no name was provided OR an 'x' was removed OR the input field was changed, but empty on blur.
          // Use the value in the time block previous to the one being edited and propagate the value as you normally would.

          if (shiftLineTimeBlockIndex == 0) {
            // Special case: First time block on the line.  There is no previous value to use.  Should set to undefined.
            editedCrewMemberShiftLineTimeBlock.crew_member_id = -1;  
            editedCrewMemberShiftLineTimeBlock.crew_member = undefined;
            purgeCrewMember = true;

          } else {
            // Normal case: Value in previous block exists and should be used.
            let previousShiftLineTimeBlock = shiftLineTimeBlocks[shiftLineTimeBlockIndex - 1];
            let previousCrewMemberShiftLineTimeBlocks = previousShiftLineTimeBlock.crew_member_shift_line_time_blocks;
            let previousToEditedCrewMemberShiftLineTimeBlock = previousCrewMemberShiftLineTimeBlocks[crewMemberShiftLineTimeBlocksIndex];

            editedCrewMemberShiftLineTimeBlock.crew_member = previousToEditedCrewMemberShiftLineTimeBlock.crew_member;
            editedCrewMemberShiftLineTimeBlock.crew_member_id = previousToEditedCrewMemberShiftLineTimeBlock.crew_member_id;
          }
          
        }

        for (let i = shiftLineTimeBlockIndex+1; i < shiftLineTimeBlocks.length; i++) {
          // Process all remaining future blocks on the line being edited.

          let nextCrewMemberShiftLineTimeBlock: CrewMemberShiftLineTimeBlocksModel = shiftLineTimeBlocks[i].crew_member_shift_line_time_blocks[crewMemberShiftLineTimeBlocksIndex];

          if (nextCrewMemberShiftLineTimeBlock.crew_member_id == -1) {
            // Represents a previously saved 'x'.  Stop processing beyond this point.
            break;
          } 

          if (nextCrewMemberShiftLineTimeBlock.crew_member?.id == crewMemberToReplace?.id) {
            //console.log("Attempting to replace the old crew member with new crew member...");
            if (purgeCrewMember) {
              // An 'x' has been entered or crew member has been deleted, so propagate removal on concurrent blocks matching crew member.
              nextCrewMemberShiftLineTimeBlock.crew_member_id = undefined;
              nextCrewMemberShiftLineTimeBlock.crew_member = undefined;

            } else {
              // Set the block to the newly entered name.
              nextCrewMemberShiftLineTimeBlock.crew_member = editedCrewMemberShiftLineTimeBlock.crew_member;
              nextCrewMemberShiftLineTimeBlock.crew_member_id = editedCrewMemberShiftLineTimeBlock.crew_member?.id;

            }
          } else {
            // The next name in adjoining block does not match, so stop processing.
            break;
          }

        }

        this.motherhoodShiftScheduleChange.next(this.motherhoodShiftSchedule);

      }
      
    } else {
      this.alertService.error("Unexpected error: Unable to find matching time block in records.  Contact 732 OSXP if the problem persists.");

    }

  }

  createLineForSchedule(lineName) {
    this.isLoading = true;
    this.isLoadingChange.next(this.isLoading);
    
    this.lineTemplateService.getLineTemplates(this._squadronFilter, true, lineName).subscribe(data => {
      let lineTemplates: LineTemplateModel[] = data;

      if (lineTemplates.length == 0) {
        this.alertService.error("Unexpected error: Unable to find matching active template by that name.  Contact 732 OSXP if the problem persists.");
        return; 
      }

      if (lineTemplates.length > 1) {
        this.alertService.info("Multiple records returned (expected only one).  Using the first record.", { 'autoClose': true });
      }

      this.lineInstanceService.addLineInstance(0, lineTemplates[0].id, this.motherhoodShiftSchedule.shift_template_instance.id).subscribe(data => {
        let newLineInstance = data;

        // Create shift line time blocks.
        let newShiftLineTimeBlocks: ShiftLineTimeBlockModel[] = [];
        let startTimeAsString: string = this.datePipe.transform(this.motherhoodShiftSchedule.shift_template.start_time, 'HH:mm', 'UTC');
        //let startTimeAsString: string = this.motherhoodShiftSchedule.shift_template.start_time as unknown as string;  // Even though it's a Date type, a string is still getting stored here when not pulled direct from API.
        let hours: number = startTimeAsString.slice(0, 2) as unknown as number;
        let minutes: number = startTimeAsString.slice(-2) as unknown as number;
        let startTime = new Date(Date.UTC(this._dateFilter.getFullYear(), this._dateFilter.getMonth(), this._dateFilter.getDate(), hours, minutes, 0, 0));

        newShiftLineTimeBlocks = newShiftLineTimeBlocks.concat(this.shiftLineTimeBlockService.createShiftLineTimeBlocksForLineInstance(newLineInstance.id, 
                                                                                                                                       startTime, 
                                                                                                                                       this.motherhoodShiftSchedule.shift_template.total_hours));
    
        this.shiftLineTimeBlockService.addShiftLineTimeBlocks(newShiftLineTimeBlocks).subscribe(data => {
          let newShiftLineTimeBlocks = data;

          // Create (4) crew member shift line time blocks for every shift line time block (crew members blank).
          let newCrewMemberShiftLineTimeBlocks: CrewMemberShiftLineTimeBlocksModel[] = [];
          for (let shiftLineTimeBlock of newShiftLineTimeBlocks) {
            newCrewMemberShiftLineTimeBlocks = newCrewMemberShiftLineTimeBlocks.concat(this.crewMemberShiftLineTimeBlockService.createGenericCrewMemberShiftLineTimeBlocksForShiftLineTimeBlock(shiftLineTimeBlock.id));
          }

          this.crewMemberShiftLineTimeBlockService.addCrewMemberShiftLineTimeBlocks(newCrewMemberShiftLineTimeBlocks).subscribe(data => {
            newCrewMemberShiftLineTimeBlocks = data;
            
            this.reloadLineInstanceForSchedule(newLineInstance);
          })
        })
      })
      
    });
    
  }

  reloadLineInstanceForSchedule(lineInstance: LineInstanceModel) {
    // Modified version of load() to handle just a single line.
    this.isLoading = true;
    this.isLoadingChange.next(this.isLoading);

    this.lineInstanceService.getLineInstanceByID(lineInstance.id).subscribe(data => {
      let reloadedLineInstance = data;
      let newLineInstances: LineInstanceModel[] = this.motherhoodShiftSchedule.line_instances;

      newLineInstances = newLineInstances.concat(reloadedLineInstance);
      newLineInstances = newLineInstances.sort((a,b) => 0 - (a.line_template?.order_preference > b.line_template?.order_preference ? -1 : 1));

      this.motherhoodShiftSchedule = new MotherhoodShiftScheduleModel(this.motherhoodShiftSchedule.shift_template, this.motherhoodShiftSchedule.shift_template_instance, newLineInstances);
      this.motherhoodShiftScheduleChange.next(this.motherhoodShiftSchedule);

      this.isLoading = false;
      this.isLoadingChange.next(this.isLoading);
    });

  }

  calculateTotalHoursScheduled(flightOrders: FlightOrdersModel[], conflicts?: CrewMemberShiftLineTimeBlocksModel[]): FlightOrdersModel[] {
    let hasChanges: boolean = false;

    flightOrders.forEach(flightOrder => {
      let totalHours: number = 0;

      this.motherhoodShiftSchedule?.line_instances.forEach(lineInstance => {
        lineInstance?.shift_line_time_blocks.forEach(shiftLineTimeBlock => {
          shiftLineTimeBlock?.crew_member_shift_line_time_blocks.forEach(crewMemberShiftLineTimeBlock => {
            if (crewMemberShiftLineTimeBlock.crew_member?.id == flightOrder.crew_member_id) {
              totalHours = totalHours + 0.5;
            }
          });
        });
      });

      conflicts?.forEach(conflictBlock => {
        if (conflictBlock.crew_member?.id == flightOrder.crew_member_id) {
          // Prevent double counting of any time block where the crew member is scheduled multiple times.
          totalHours = totalHours - 0.5;  

        }
      });

      if (flightOrder.total_hours_scheduled != totalHours) {
        flightOrder.total_hours_scheduled = totalHours;
        hasChanges = true;
      }
      
    });

    if (hasChanges) {
      // Prevents endless loop of re-calculating total hours.
      this.flightOrderService.setFlightOrders(flightOrders);
    }
    
    return flightOrders;

  }

  updateColorForSelectedBlocks(selectedCrewMemberShiftLineTimeBlocks: CrewMemberShiftLineTimeBlocksModel[], blockCategory: BlockCategoryModel) {
    if (selectedCrewMemberShiftLineTimeBlocks && this.motherhoodShiftSchedule) {
      // Determine the shift blocks that correspond for the selected crew member shift line time blocks.
      let shiftBlockIDs: number[] = selectedCrewMemberShiftLineTimeBlocks.map(timeBlock => timeBlock.shift_line_time_block_id);
      let shiftBlocks: ShiftLineTimeBlockModel[] = [];
      this.motherhoodShiftSchedule?.line_instances.forEach(lineInstance => {
        lineInstance.shift_line_time_blocks.forEach(shiftLineTimeBlock => {
          if (shiftBlockIDs.find(id => id == shiftLineTimeBlock.id)) {
            shiftBlocks.push(shiftLineTimeBlock);
          }
        })
      })

      shiftBlocks.forEach(shiftBlock => {
        shiftBlock.block_category = blockCategory;
        shiftBlock.block_category_id = blockCategory?.id;
      });

      this.motherhoodShiftSchedule = new MotherhoodShiftScheduleModel(this.motherhoodShiftSchedule.shift_template, 
                                                                      this.motherhoodShiftSchedule.shift_template_instance, 
                                                                      this.motherhoodShiftSchedule.line_instances);
      this.motherhoodShiftScheduleChange.next(this.motherhoodShiftSchedule);
    }

  }

  removeLineInstanceFromSchedule(lineInstanceToRemove: LineInstanceModel) {
    let filteredLineInstances = this.motherhoodShiftSchedule.line_instances.filter(lineInstance => lineInstance.id != lineInstanceToRemove.id);
    this.motherhoodShiftSchedule.line_instances = filteredLineInstances;
    this.motherhoodShiftScheduleChange.next(this.motherhoodShiftSchedule);

    let shiftLineTimeBlockIDs: number[] = [];
    let crewMemberShiftLineTimeBlockIDs: number[] = [];

    this.lineInstanceService.deleteLineInstance(lineInstanceToRemove.id).subscribe(data => {
      lineInstanceToRemove.shift_line_time_blocks.forEach(shiftLineTimeBlock => {
          shiftLineTimeBlockIDs.push(shiftLineTimeBlock.id);

          shiftLineTimeBlock.crew_member_shift_line_time_blocks.forEach(timeBlock => {
            crewMemberShiftLineTimeBlockIDs.push(timeBlock.id);
          });

      });

      this.shiftLineTimeBlockService.batchDeleteShiftLineTimeBlocks(shiftLineTimeBlockIDs).subscribe(data => {
        // console.log("Deletion of shift line time blocks complete.");
      });
  
      this.crewMemberShiftLineTimeBlockService.batchDeleteCrewMemberShiftLineTimeBlocks(crewMemberShiftLineTimeBlockIDs).subscribe(data => {
        // console.log("Deletion of crew member shift line time blocks complete.");
      });
      
    });

  }

}
