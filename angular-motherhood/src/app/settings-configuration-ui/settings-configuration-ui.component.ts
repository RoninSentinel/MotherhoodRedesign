import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AlertService } from '../shared/components/alert-notifications';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-settings-configuration-ui',
  templateUrl: './settings-configuration-ui.component.html',
  styleUrls: ['./settings-configuration-ui.component.css']
})
export class SettingsConfigurationUiComponent implements OnInit, AfterViewInit {

  currentSquadron: string;
  accessLevel: string;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    protected alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.currentSquadron = this.route.snapshot.paramMap.get('squadron');
    
    let accessLevel: string = sessionStorage.getItem('accessLevel');
    if (accessLevel) {
      this.accessLevel = accessLevel;

      if (this.accessLevel === 'basic') {
        this.alertService.info("Edit permissions are enabled for only Basic Configuration section.", { 'autoClose': true });
      }

      //localStorage.clear();
    } else {
      this.alertService.error("Edit permissions are disabled.  Enable edit mode on main motherhood page.");
    }

  }

  ngAfterViewInit() {
    
  }

  backClicked() {
    this.location.back();
  }


}
