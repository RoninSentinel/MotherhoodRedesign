import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquadronHeaderComponent } from './squadron-header.component';

describe('SquadronHeaderComponent', () => {
  let component: SquadronHeaderComponent;
  let fixture: ComponentFixture<SquadronHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SquadronHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SquadronHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
