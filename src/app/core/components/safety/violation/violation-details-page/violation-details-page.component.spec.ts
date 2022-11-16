import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationDetailsPageComponent } from './violation-details-page.component';

describe('ViolationDetailsPageComponent', () => {
  let component: ViolationDetailsPageComponent;
  let fixture: ComponentFixture<ViolationDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViolationDetailsPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolationDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
