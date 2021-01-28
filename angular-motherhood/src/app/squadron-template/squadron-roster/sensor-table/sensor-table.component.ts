import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

export interface PeriodicElement {
  name: string;
  quals: string;
  hours: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Alexander Hamilton', quals: 'Sensor, Instructor', hours: 1776},
  { name: 'James Madison', quals: 'Sensor', hours: 700},
  { name: 'John Paul Jones', quals: 'Sensor, Instructor', hours: 1776},
  { name: 'Patrick Henry', quals: 'Sensor', hours: 1500},
  { name: 'John Hancock', quals: 'Sensor, Instructor', hours: 2776},
];

/**
 * @title Table with sorting
 */
@Component({
  selector: 'app-sensor-table',
  templateUrl: './sensor-table.component.html',
  styleUrls: ['./sensor-table.component.css']
})
export class SensorTableComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'quals', 'hours'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}