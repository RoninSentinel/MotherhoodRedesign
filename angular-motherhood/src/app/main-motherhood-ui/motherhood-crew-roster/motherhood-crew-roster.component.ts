import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { CrewMemberModel, CrewMemberTypeModel } from 'src/app/model-types';
import { CrewMemberTypeService } from 'src/app/services/crew-member-type.service';
import { CrewMemberService } from 'src/app/services/crew-member.service';
import { FlightService } from 'src/app/services/flight.service';
import { Input } from '@angular/core';

@Component({
  selector: 'motherhood-crew-roster',
  templateUrl: 'motherhood-crew-roster.component.html',
  styleUrls: ['./motherhood-crew-roster.component.css'],
})
export class MotherhoodCrewRosterComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    @Output() crewRosterRowSelectedEvent = new EventEmitter<CrewMemberModel>();

    @Input() editMode: boolean;

    crewMembers: CrewMemberModel[];
    currentSquadron: string;
    crewMemberTypes: CrewMemberTypeModel[];
    crewMemberTypesAvailableForSelection = [];
    isLoading = true;

    displayedColumns: string[] = ['select', 'rank', 'last_name', 'call_sign', 'squadron_id', 'flight_name', 'team_name'];
    dataSource: MatTableDataSource<CrewMemberModel>;
    selection = new SelectionModel<CrewMemberModel>(true, []);

    constructor(
      public crewMemberService: CrewMemberService,
      public flightService: FlightService,
      public crewMemberTypeService: CrewMemberTypeService,
    ){}

    ngOnInit(): void {

      this.isLoading = true;
      // All crew members across all squadrons
      this.crewMemberService.getCrewMembers().subscribe(data => {
        this.crewMembers = data;
  
        // There is a chance that the form will attempt to set the paginator and sort sooner than it gets the data,
        // so auto-reset the form when data is received.
        this.dataSource = new MatTableDataSource<CrewMemberModel>(this.crewMembers);
        this.resetCrewMemberRoster();

        this.isLoading = false;
      });

    }

    ngAfterViewInit() {
      // There is a chance the form begins to set values before the data from the backend is received.
      if (this.dataSource) {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    }

    async crewRosterRowSelected(row_selected: boolean) {
        if (row_selected) {
          if (this.selection.selected.length == 1) {
            const crewMembersSelected = this.selection.selected.values();
            for (let crewMemberSelected of crewMembersSelected) {
              this.crewRosterRowSelectedEvent.emit(crewMemberSelected);
            }
            
            await new Promise(resolve => setTimeout(resolve, 500));
            this.selection.clear();
          }
        }
      }

    resetCrewMemberRoster() {
      this.dataSource = new MatTableDataSource<CrewMemberModel>(this.crewMembers)
      this.dataSource.data = this.dataSource.data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    /** https://material.angular.io/components/table/examples */

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
      // There is a chance the form begins to set values before the data from the backend is received.
      if (! this.dataSource) {
        return false;
      }

      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: CrewMemberModel): string {
      if (!row) {
        return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }

}