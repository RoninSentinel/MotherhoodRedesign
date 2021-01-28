import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LineInstanceModel } from 'src/app/model-types';


@Component({
  selector: 'motherhood-datetime-banner',
  templateUrl: './motherhood-datetime-banner.component.html',
  styleUrls: ['./motherhood-datetime-banner.component.css']
})
export class MotherhoodDatetimeBannerComponent implements OnInit {

  @Output() shiftDateChangeEvent = new EventEmitter<Date>();
  @Output() currentTimeChangeEvent = new EventEmitter<Date>();

  @Input() firstLine: LineInstanceModel;
  @Input() editMode: boolean;
  @Input() callSignPreference: boolean;
  
  currentTimeIndex: number;
  currentDate: Date;
  currentTime: Date;
  currentSquadron: string;
  currentShift: string;
  mcc: string = "";
  mccB: string = "";
  timer;
  delayedTimer;


  shiftDateForm = this.formBuilder.group({
    shiftDate: [''],
  });

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}
  
  ngOnInit(): void {

    this.currentDate = new Date();
    let utc: number = Date.UTC(this.currentDate.getUTCFullYear(), this.currentDate.getUTCMonth(), this.currentDate.getUTCDate());
    this.currentDate = new Date(utc);
    this.shiftDateChangeEvent.emit(this.currentDate);
    this.shiftDateForm.patchValue({shiftDate: this.datePipe.transform(this.currentDate, 'yyyy-MM-dd', 'UTC'),});

    this.currentSquadron = this.route.snapshot.paramMap.get('squadron');
    this.currentShift = this.route.snapshot.paramMap.get('shift');

    this.currentTime = new Date();
    this.currentTimeChangeEvent.emit(this.currentTime);
    
    this.timer = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

    this.delayedTimer = setInterval(() => {
      this.currentTimeChangeEvent.emit(this.currentTime);
    }, 60000);
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.firstLine && changes.firstLine.currentValue) {
      this.updateMCCs();
    }

  }

  updateShiftDate() {
    if (this.currentDate == this.shiftDateForm.value.shiftDate) {
      return;

    } 
    
    if (this.shiftDateForm.value.shiftDate) {

      let dateSelected: Date = this.shiftDateForm.value.shiftDate;
      let dateConverted: Date = new Date(dateSelected);
      let utc: number = Date.UTC(dateConverted.getUTCFullYear(), dateConverted.getUTCMonth(), dateConverted.getUTCDate());
      this.currentDate = new Date(utc);

      this.clearMCCs();

      this.shiftDateChangeEvent.emit(this.currentDate);
    }
  }

  updateCurrentTimeIndex(timeIndex: number) {
    this.currentTimeIndex = timeIndex;
    this.updateMCCs();
  }

  updateMCCs() {

    if (this.currentTimeIndex == -1) {
      // Display a name, even if the shift hasn't started yet.
      this.currentTimeIndex = 0;
    }

    // MCC: Use call sign or last name.
    if (this.callSignPreference && this.firstLine?.shift_line_time_blocks[this.currentTimeIndex]?.crew_member_shift_line_time_blocks[0]?.crew_member?.call_sign && !this.editMode) {
      this.mcc = this.firstLine?.shift_line_time_blocks[this.currentTimeIndex]?.crew_member_shift_line_time_blocks[0]?.crew_member?.call_sign;

    } else {
      this.mcc = this.firstLine?.shift_line_time_blocks[this.currentTimeIndex]?.crew_member_shift_line_time_blocks[0]?.crew_member?.last_name;

    }

    // MCC-B: Use call sign or last name.
    if (this.callSignPreference && this.firstLine?.shift_line_time_blocks[this.currentTimeIndex]?.crew_member_shift_line_time_blocks[1]?.crew_member?.call_sign && !this.editMode) {
      this.mccB = this.firstLine?.shift_line_time_blocks[this.currentTimeIndex]?.crew_member_shift_line_time_blocks[1]?.crew_member?.call_sign;

    } else {
      this.mccB = this.firstLine?.shift_line_time_blocks[this.currentTimeIndex]?.crew_member_shift_line_time_blocks[1]?.crew_member?.last_name;

    }

  }

  clearMCCs() {
    this.mcc = "";
    this.mccB = "";
    this.firstLine = null;
    this.cdr.detectChanges();
  }

  get shiftDate() {
    return this.shiftDateForm.get('shiftDate');
  }

}
