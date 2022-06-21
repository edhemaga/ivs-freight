import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantNextStepComponent } from './applicant-next-step.component';

describe('ApplicantNextStepComponent', () => {
  let component: ApplicantNextStepComponent;
  let fixture: ComponentFixture<ApplicantNextStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantNextStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantNextStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
