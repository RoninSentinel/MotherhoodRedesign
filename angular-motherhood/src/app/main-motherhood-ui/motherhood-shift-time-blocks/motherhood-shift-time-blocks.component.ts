import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShiftTemplateService } from 'src/app/services/shift-template.service';
import { ShiftTemplateModel } from 'src/app/model-types';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'motherhood-shift-time-blocks',
  templateUrl: './motherhood-shift-time-blocks.component.html',
  styleUrls: ['./motherhood-shift-time-blocks.component.css']
})
export class MotherhoodShiftTimeBlocksComponent implements OnInit {

  @Output() newTimeIndexEvent = new EventEmitter<number>();
  @Input() currentTime: Date;
  @Input() shiftDate: Date;
  currentTimeIndex: number = -1;

  isLoading: boolean = true;
  isDST: boolean = false;
  usePacificTimeZone: boolean = true;  // Computer OR Pacific time.
  errorRetrievingShiftData: boolean = false;
  shiftTemplate: ShiftTemplateModel;
  currentSquadron: string;
  currentShift: string;
  timeBlocks: Date[];

  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    public shiftTemplateService: ShiftTemplateService,
  ) {}
  
  ngOnInit(): void {
    this.currentSquadron = this.route.snapshot.paramMap.get('squadron');
    this.currentShift = this.route.snapshot.paramMap.get('shift');
    this.isLoading = true;

    this.shiftTemplateService.getShiftTemplates(this.currentSquadron, this.currentShift).subscribe(data => {
      if (data.length == 0) {
        this.errorRetrievingShiftData = true;

      } else {
        // Assumes only one active shift template at a time.
        this.shiftTemplate = data.find(element => element.is_active == 1);
        this.calculateUTCTimesForShift();
      }
      
      this.currentTimeIndex = this.calculateCurrentTimeIndex();
      
      this.isLoading = false;
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentTime && changes.currentTime.currentValue) {
      this.currentTimeIndex = this.calculateCurrentTimeIndex();
      this.cdr.detectChanges();
    }

    if (changes.shiftDate && changes.shiftDate.currentValue) {
      this.calculateUTCTimesForShift();
    }

  }

  calculateUTCTimesForShift() {
    this.timeBlocks = [];
    let startTime = this.shiftTemplate?.start_time;
    if (startTime) {
      const totalHours: number = this.shiftTemplate.total_hours;

      if (totalHours == 0) {
        return;
      }
  
      let totalTimeBlocks: number = this.shiftTemplate.total_hours / 0.5;
      const timeIncrement = 30;  // Half hour blocks.
  
      this.isDST = moment(this.shiftDate).isDST();
      this.timeBlocks.push(moment(startTime).toDate());
  
      let index: number = 1;
      while (index < totalTimeBlocks) {
        //https://stackoverflow.com/questions/1197928/how-to-add-30-minutes-to-a-javascript-date-object
        let timeBasedOnIndex = moment(startTime).add(timeIncrement*(index), 'm').toDate();
        this.timeBlocks.push(timeBasedOnIndex);
        index++;
      }
  
      this.currentTimeIndex = this.calculateCurrentTimeIndex();
    }

  }

  calculateCurrentTimeIndex() : number {
    let indexLocation = -1;

    for (let i = 0; i < this.timeBlocks?.length; i++) {
      if ((i + 1) == this.timeBlocks?.length) {
        let endShiftTime = moment(this.timeBlocks[i]).add(30, 'm').toDate();

        if ((this.currentTime >= this.timeBlocks[i]) && (this.currentTime < endShiftTime)) {
          this.newTimeIndexEvent.emit(i);
          return i;
        }

      } else {
        if ((this.currentTime >= this.timeBlocks[i]) && (this.currentTime < this.timeBlocks[i+1])) {
          this.newTimeIndexEvent.emit(i);
          return i;
        }

      }
    }
    this.newTimeIndexEvent.emit(indexLocation);
    return indexLocation;

  }

  getLocalTime(timeBlock) {
    // this.datePipe.transform(this.currentDate, 'yyyy-MM-dd', 'UTC')
    if (this.usePacificTimeZone) {
      if (this.isDST) {
        return this.datePipe.transform(timeBlock, 'HHmm', 'PDT');
      } else {
        return this.datePipe.transform(timeBlock, 'HHmm', 'PST');
      }

    } else {
      return this.datePipe.transform(timeBlock, 'HHmm');

    }
  }

  toggleLocalTime() {
    this.usePacificTimeZone = !this.usePacificTimeZone;

  }

}
