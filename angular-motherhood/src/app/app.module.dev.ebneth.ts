import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SettingsConfigurationUiComponent } from './settings-configuration-ui/settings-configuration-ui.component';
import { TutorialUiComponent } from './tutorial-ui/tutorial-ui.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AORSettingsComponent } from './settings-configuration-ui/advanced/aor/aor-settings.component';
import { CrewMemberTypeSettingsComponent } from './settings-configuration-ui/advanced/crew-member-type/crew-member-type-settings.component';
import { LineTypeSettingsComponent } from './settings-configuration-ui/advanced/line-type/line-type-settings.component';
import { SquadronSettingsComponent } from './settings-configuration-ui/advanced/squadron/squadron-settings.component';
import { QualificationTypeSettingsComponent } from './settings-configuration-ui/advanced/qualification-type/qualification-type-settings.component';
import { ShiftTemplateSettingsComponent } from './settings-configuration-ui/advanced/shift-template/shift-template-settings.component';
import { TeamSettingsComponent } from './settings-configuration-ui/basic/team/team-settings.component';
import { BlockCategorySettingsComponent } from './settings-configuration-ui/basic/block-category/block-category-settings.component';
import { CrewMemberSettingsComponent } from './settings-configuration-ui/basic/crew-member/crew-member-settings.component';
import { FlightSettingsComponent } from './settings-configuration-ui/basic/flight/flight-settings.component';
import { LineTemplateSettingsComponent } from './settings-configuration-ui/basic/line-template/line-template-settings.component';
import { QualificationsChipComponent } from './settings-configuration-ui/basic/qualifications/qualifications-chip/qualifications-chip-component';
import { MainMotherhoodUiComponent } from './main-motherhood-ui/main-motherhood-ui.component';
import { MotherhoodBlockColorsComponent } from './main-motherhood-ui/motherhood-block-colors/motherhood-block-colors.component';
import { MotherhoodDatetimeBannerComponent } from './main-motherhood-ui/motherhood-datetime-banner/motherhood-datetime-banner.component';
import { MotherhoodMenuControlsComponent } from './main-motherhood-ui/motherhood-menu-controls/motherhood-menu-controls.component';
import { MotherhoodShiftTimeBlocksComponent } from './main-motherhood-ui/motherhood-shift-time-blocks/motherhood-shift-time-blocks.component';
import { MotherhoodGCSLinesComponent } from './main-motherhood-ui/motherhood-gcs-lines/motherhood-gcs-lines.component';
import { MotherhoodFlightOrdersComponent } from './main-motherhood-ui/motherhood-flight-orders/motherhood-flight-orders.component';
import { MotherhoodCrewRosterComponent } from './main-motherhood-ui/motherhood-crew-roster/motherhood-crew-roster.component';
import { MotherhoodCrewSummaryComponent } from './main-motherhood-ui/motherhood-crew-summary/motherhood-crew-summary.component';

import { AutoFocusDirective } from './directives/auto-focus.directive';

import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';
import { DragToSelectModule } from 'ngx-drag-to-select';
import { AlertModule } from './shared/components/alert-notifications';

import { YesNoPipe } from './pipes/yes-no.pipe';
import { DatePipe } from '@angular/common';

import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin


FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);


@NgModule({
  declarations: [
    AppComponent,
    SettingsConfigurationUiComponent,
    TutorialUiComponent,
    AORSettingsComponent,
    CrewMemberTypeSettingsComponent,
    LineTypeSettingsComponent,
    SquadronSettingsComponent,
    QualificationTypeSettingsComponent,
    ShiftTemplateSettingsComponent,
    TeamSettingsComponent,
    BlockCategorySettingsComponent,
    CrewMemberSettingsComponent,
    FlightSettingsComponent,
    LineTemplateSettingsComponent,
    QualificationsChipComponent,
    AutoFocusDirective,
    YesNoPipe,
    MotherhoodHomeComponent,
    SquadronHeaderComponent,
    //AorTemplateComponent,
    //AorHeaderComponent,
    //AorRosterComponent,
    //AorScheduleComponent,
    //AorBoardComponent,
    SquadronTemplateComponent,
    SquadronRosterComponent,
    SquadronSchedulerComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule, 
    MatSortModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    NgxMatColorPickerModule,
    AlertModule,
    //EntityDataModule.forRoot(entityConfig),
  ],
  providers: [{ provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
