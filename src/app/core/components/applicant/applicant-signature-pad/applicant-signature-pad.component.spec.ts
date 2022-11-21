import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantSignaturePadComponent } from './applicant-signature-pad.component';

describe('ApplicantSignaturePadComponent', () => {
  let component: ApplicantSignaturePadComponent;
  let fixture: ComponentFixture<ApplicantSignaturePadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicantSignaturePadComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantSignaturePadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
