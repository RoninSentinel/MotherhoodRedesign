import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialUiComponent } from './tutorial-ui.component';

describe('TutorialUiComponent', () => {
  let component: TutorialUiComponent;
  let fixture: ComponentFixture<TutorialUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorialUiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
