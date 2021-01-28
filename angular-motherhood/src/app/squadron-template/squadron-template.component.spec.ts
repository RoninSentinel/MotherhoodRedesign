import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquadronTemplateComponent } from './squadron-template.component';

describe('SquadronTemplateComponent', () => {
  let component: SquadronTemplateComponent;
  let fixture: ComponentFixture<SquadronTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SquadronTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SquadronTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
