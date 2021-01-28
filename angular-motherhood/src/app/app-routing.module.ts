import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainMotherhoodUiComponent } from './main-motherhood-ui/main-motherhood-ui.component';
import { MotherhoodHomeComponent } from './motherhood-home/motherhood-home.component';
import { SettingsConfigurationUiComponent } from './settings-configuration-ui/settings-configuration-ui.component';
import { TutorialUiComponent } from './tutorial-ui/tutorial-ui.component';
import { SquadronTemplateComponent} from './squadron-template/squadron-template.component'
import {SitemapComponent} from './sitemap/sitemap.component';

const routes: Routes = [
  { path: '', redirectTo: 'sitemap', pathMatch: 'full' },
  { path: 'sitemap', component: SitemapComponent, pathMatch: 'full' },
  { path: 'motherhood', component: MainMotherhoodUiComponent, pathMatch: 'full'},
  { path: 'motherhood/:squadron', component: MainMotherhoodUiComponent, pathMatch: 'full'},
  { path: 'motherhood/:squadron/settings', component: SettingsConfigurationUiComponent, pathMatch: 'full' },
  { path: 'motherhood/:squadron/:shift', component: MainMotherhoodUiComponent, pathMatch: 'full'},
  { path: 'motherhood/tutorial', component: TutorialUiComponent },
  { path: 'motherhood-home', component: MotherhoodHomeComponent, pathMatch: 'full'},
  { path: 'motherhood-template', component: SquadronTemplateComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
