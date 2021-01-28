import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquadronSchedulerComponent } from './squadron-scheduler.component';

describe('SquadronSchedulerComponent', () => {
  let component: SquadronSchedulerComponent;
  let fixture: ComponentFixture<SquadronSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SquadronSchedulerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SquadronSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
