import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'; // a plugin
import { CalendarOptions } from '@fullcalendar/angular';

@Component({
  selector: 'app-squadron-scheduler',
  templateUrl: './squadron-scheduler.component.html',
  styleUrls: ['./squadron-scheduler.component.css']
})
export class SquadronSchedulerComponent implements OnInit {
  
  
  constructor() { 
    
  }

  ngOnInit(): void {
  }

}
