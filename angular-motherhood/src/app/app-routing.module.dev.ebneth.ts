import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainMotherhoodUiComponent } from './main-motherhood-ui/main-motherhood-ui.component';
import { MotherhoodHomeComponent } from './motherhood-home/motherhood-home.component';
import { SettingsConfigurationUiComponent } from './settings-configuration-ui/settings-configuration-ui.component';
import { TutorialUiComponent } from './tutorial-ui/tutorial-ui.component';

const routes: Routes = [
  { path: '', redirectTo: 'motherhood-home', pathMatch: 'full' },
  { path: 'motherhood-home', component: MotherhoodHomeComponent, pathMatch: 'full'},
  { path: 'motherhood-home/:squadron', component: MotherhoodHomeComponent, pathMatch: 'full'},
  { path: 'motherhood-home/:squadron/settings', component: SettingsConfigurationUiComponent, pathMatch: 'full' },
  { path: 'motherhood-home/:squadron/:shift', component: MotherhoodHomeComponent, pathMatch: 'full'},
  { path: 'motherhood-tutorial', component: TutorialUiComponent },
  { path: 'settings', component: SettingsConfigurationUiComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
