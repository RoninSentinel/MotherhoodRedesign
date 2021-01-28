import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquadronRosterComponent } from './squadron-roster.component';

describe('SquadronRosterComponent', () => {
  let component: SquadronRosterComponent;
  let fixture: ComponentFixture<SquadronRosterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SquadronRosterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SquadronRosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
