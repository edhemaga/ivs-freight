import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationDetailsSingleComponent } from './violation-details-single.component';

describe('ViolationDetailsSingleComponent', () => {
  let component: ViolationDetailsSingleComponent;
  let fixture: ComponentFixture<ViolationDetailsSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViolationDetailsSingleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolationDetailsSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
