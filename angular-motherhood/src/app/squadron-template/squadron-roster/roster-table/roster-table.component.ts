import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import * as $ from 'jquery';

export interface PeriodicElement {
  name: string;
  quals: string;
  hours: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Sam Adams', quals: 'Pilot, Instructor', hours: 1776},
  { name: 'Thomas Jefferson', quals: 'Pilot', hours: 700},
  { name: 'George Washington', quals: 'Pilot, Instructor', hours: 1776},
  { name: 'John Adams', quals: 'Pilot', hours: 1500},
  { name: 'Ben Franklin', quals: 'Pilot, Instructor', hours: 2776},
];
$('.AddNew').click(function(){
  var row = $(this).closest('tr').clone();
  row.find('input').val('');
  $(this).closest('tr').after(row);
  $('input[type="button"]', row).removeClass('AddNew').addClass('RemoveRow').val('Remove item');
});

$('table').on('click', '.RemoveRow', function(){
 $(this).closest('tr').remove();
});
/**
 * @title Table with sorting
 */
@Component({
  selector: 'app-roster-table',
  templateUrl: './roster-table.component.html',
  styleUrls: ['./roster-table.component.css']
})
export class RosterTableComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'quals', 'hours'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  
}
