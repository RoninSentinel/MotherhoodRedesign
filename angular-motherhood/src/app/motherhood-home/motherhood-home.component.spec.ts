import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotherhoodHomeComponent } from './motherhood-home.component';

describe('MotherhoodHomeComponent', () => {
  let component: MotherhoodHomeComponent;
  let fixture: ComponentFixture<MotherhoodHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotherhoodHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MotherhoodHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
