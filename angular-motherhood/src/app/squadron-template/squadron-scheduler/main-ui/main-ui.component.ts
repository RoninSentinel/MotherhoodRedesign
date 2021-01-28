import { Component, ViewEncapsulation, Inject, ViewChild, OnInit } from '@angular/core';
import { flightData, rosterList } from './data';
import { extend, closest, remove, addClass, L10n, loadCldr } from '@syncfusion/ej2-base';
import {
    EventSettingsModel, View, ScheduleAllModule, GroupModel, TimelineViewsService, TimelineMonthService,
    ResizeService, WorkHoursModel, DragAndDropService, ResourceDetails, ScheduleComponent, ActionEventArgs, CellClickEventArgs,EventRenderedArgs, Schedule
} from '@syncfusion/ej2-angular-schedule';
import { DragAndDropEventArgs } from '@syncfusion/ej2-navigations';
import { TreeViewComponent } from '@syncfusion/ej2-angular-navigations';
import { TimeFormatObject, TimePicker } from '@syncfusion/ej2-calendars';
import $ from 'jquery';
import { Time } from '@angular/common';
import { ColorPicker } from '@syncfusion/ej2-inputs';
declare var require: any;
loadCldr(
    require('cldr-data/supplemental/numberingSystems.json'),
    require('cldr-data/main/en-GB/ca-gregorian.json'),
    require('cldr-data/main/en-GB/numbers.json'),
    require('cldr-data/main/en-GB/timeZoneNames.json'));

@Component({
    selector: 'app-main-ui',
    templateUrl: 'main-ui.component.html',
    styleUrls: ['main-ui.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [TimelineViewsService, TimelineMonthService, ResizeService, DragAndDropService]
})
export class MainUiComponent{
    @ViewChild('scheduleObj')
    public scheduleObj: ScheduleComponent;
    @ViewChild('treeObj')
    public treeObj: TreeViewComponent;

    public isTreeItemDropped: boolean = false;
    public draggedItemId: string = '';

    public data: Object[] = <Object[]>extend([], flightData, null, true);
    public selectedDate: Date = new Date();
    public currentView: View = 'TimelineDay';
    public LOCALE_ID ='en-GB';
    public workHours: WorkHoursModel = { start: '07:30', end: '16:30' };
    public cellHeight: String = "80px";
     
    public departmentDataSource: Object[] = [
        { Text: 'FLIGHT LINES', Id: 1, Color: 'rgba(113, 112, 106, 0.75)' },
        { Text: 'PILOT LINEUP', Id: 2, Color: 'grey' },
        { Text: 'SENSOR LINEUP', Id: 3, Color: 'grey' }
        
    ];
    public GCSCockpitDataSource: Object[] = [
        { Text: 'Iron', Id: 1, GroupId: 1, Color: 'rgba(113, 112, 106, 0.6)' },
        { Text: 'Cobolt', Id: 2, GroupId: 1, Color: 'rgba(113, 112, 106, 0.6)' },
        { Text: 'Saphire', Id: 4, GroupId: 1, Color: 'rgba(113, 112, 106, 0.75)' },
        { Text: 'Copper', Id: 3, GroupId: 1, Color: 'rgba(113, 112, 106, 0.75)' },
        { Text: 'Gold', Id: 5, GroupId: 1, Color: 'rgba(113, 112, 106, 0.75)' },
        { Text: 'Silver', Id: 6, GroupId: 1, Color: 'rgba(113, 112, 106, 0.75)' },

        { Text: 'Steven Johnson', Id: 1, GroupId: 2, Designation: 'Pilot' },
        { Text: 'David Groehl', Id: 2, GroupId: 2, Designation: 'Pilot, Instructor' },
        { Text: 'Laura Johnson', Id: 3, GroupId: 2, Designation: 'Pilot' },
        
        { Text: 'Janet Joplin', Id: 4, GroupId: 3, Designation: 'Sensor, Instructor' },
        { Text: 'Steven Adams', Id: 5, GroupId: 3, Designation: 'Sensor' },
        { Text: 'John Frost', Id: 5, GroupId: 3, Designation: 'Sensor' },
    ];
    public EventColor: Object[] = [
        { Text: 'Gaining', Color: 'green' },
        { Text: 'Losing', Color: 'blue' },
        { Text: 'On Target',  Color: 'yellow' },
        { Text: 'Saphire',  Color: 'grey' },
        { Text: 'Down',  Color: 'darkgrey' }
    ];
    public group: GroupModel = { enableCompactView: false, resources: ['Departments', 'GCSCockpits','EventColor'] };
    public allowMultiple: Boolean = true;
    public allowMultiRowSelection: Boolean = true;
    public eventSettings: EventSettingsModel = {
        dataSource: this.data,
        
        fields: {
            subject: { title: 'Name', name: 'Name' },
            location: {title:'Flight Stage', name:'CategoryColor'},
            startTime: { title: 'From', name: 'StartTime' },
            endTime: { title: 'To', name: 'EndTime' },
            description: { title: 'Quals', name: 'Description' }
            
            
            
        }
        
    };
    

    public field: Object = { dataSource: rosterList, id: 'Id', text: 'Name' };
    public allowDragAndDrop: boolean = true;

    constructor() {
        
    }
    addNewLine(){
        this.GCSCockpitDataSource.push({Text: 'Gold', Id: 7, GroupId: 1, Color: 'grey'});
    }
    getGCSCockpitName(value: ResourceDetails): string {
        return (value as ResourceDetails).resourceData[(value as ResourceDetails).resource.textField] as string;
    }

    getGCSCockpitStatus(value: ResourceDetails): boolean {
        let resourceName: string =
            (value as ResourceDetails).resourceData[(value as ResourceDetails).resource.textField] as string;
        if (resourceName === 'LINES') {
            return false;
        } else {
            return true;
        }
    }

    getGCSCockpitDesignation(value: ResourceDetails): string {
        let resourceName: string =
            (value as ResourceDetails).resourceData[(value as ResourceDetails).resource.textField] as string;
        if (resourceName === 'LINES') {
            return '';
        } else {
            return (value as ResourceDetails).resourceData.Designation as string;
        }
    }

    getGCSCockpitImageName(value: ResourceDetails): string {
        return this.getGCSCockpitName(value).toLowerCase();
    }

    onItemDrag(event: any): void {
        if (this.scheduleObj.isAdaptive) {
            let classElement: HTMLElement = this.scheduleObj.element.querySelector('.e-device-hover');
            if (classElement) {
                classElement.classList.remove('e-device-hover');
            }
            if (event.target.classList.contains('e-work-cells')) {
                addClass([event.target], 'e-device-hover');
            }
        }
        document.body.style.position = 'fixed';
        if (document.body.style.cursor === 'not-allowed') {
            document.body.style.cursor = '';
        }
        if (event.name === 'nodeDragging') {
            let dragElementIcon: NodeListOf<HTMLElement> =
                document.querySelectorAll('.e-drag-item.treeview-external-drag .e-icon-expandable');
            for (let i: number = 0; i < dragElementIcon.length; i++) {
                dragElementIcon[i].style.display = 'none';
            }
        }
    }

    onActionBegin(event: ActionEventArgs): void {
        if (event.requestType === 'eventCreate' && this.isTreeItemDropped) {
            let treeViewdata: { [key: string]: Object }[] = this.treeObj.fields.dataSource as { [key: string]: Object }[];
            const filteredPeople: { [key: string]: Object }[] =
                treeViewdata.filter((item: any) => item.Id !== parseInt(this.draggedItemId, 10));
            this.treeObj.fields.dataSource = filteredPeople;
            let elements: NodeListOf<HTMLElement> = document.querySelectorAll('.e-drag-item.treeview-external-drag');
            for (let i: number = 0; i < elements.length; i++) {
                remove(elements[i]);
            }
        }
    }

    onTreeDragStop(event: DragAndDropEventArgs): void {
        let treeElement: Element = <Element>closest(event.target, '.e-treeview');
        let classElement: HTMLElement = this.scheduleObj.element.querySelector('.e-device-hover');
        if (classElement) {
            classElement.classList.remove('e-device-hover');
        }
        if (!treeElement) {
            event.cancel = true;
            let scheduleElement: Element = <Element>closest(event.target, '.e-content-wrap');
            if (scheduleElement) {
                let treeviewData: { [key: string]: Object }[] =
                    this.treeObj.fields.dataSource as { [key: string]: Object }[];
                if (event.target.classList.contains('e-work-cells')) {
                    const filteredData: { [key: string]: Object }[] =
                        treeviewData.filter((item: any) => item.Id === parseInt(event.draggedNodeData.id as string, 10));
                    let cellData: CellClickEventArgs = this.scheduleObj.getCellDetails(event.target);
                    let resourceDetails: ResourceDetails = this.scheduleObj.getResourcesByIndex(cellData.groupIndex);
                    let eventData: { [key: string]: Object } = {
                        Name: filteredData[0].Name,
                        StartTime: cellData.startTime,
                        EndTime: cellData.endTime,
                        IsAllDay: cellData.isAllDay,
                        Description: filteredData[0].Description,
                        DepartmentID: resourceDetails.resourceData.GroupId,
                        GCSCockpitID: resourceDetails.resourceData.Id,
                        EventColor: resourceDetails.resourceData.CategoryColor
                    };
                    this.scheduleObj.openEditor(eventData, 'Add', true);
                    this.isTreeItemDropped = true;
                    this.draggedItemId = event.draggedNodeData.id as string;
                }
            }
        }
    }
     oneventRendered(args: EventRenderedArgs): void {
        let categoryColor: string = args.data.CategoryColor as string;
        if (!args.element || !categoryColor) {
            return;
        }
        if (this.scheduleObj.currentView === 'Agenda') {
            (args.element.firstChild as HTMLElement).style.borderLeftColor = categoryColor;
        } else {
            args.element.style.backgroundColor = categoryColor;
        }
    }
}


