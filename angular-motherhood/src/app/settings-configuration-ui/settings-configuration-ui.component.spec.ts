import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsConfigurationUiComponent } from './settings-configuration-ui.component';

describe('SettingsConfigurationUiComponent', () => {
  let component: SettingsConfigurationUiComponent;
  let fixture: ComponentFixture<SettingsConfigurationUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsConfigurationUiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsConfigurationUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
