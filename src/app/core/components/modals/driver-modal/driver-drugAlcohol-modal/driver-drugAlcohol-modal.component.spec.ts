/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverDrugAlcoholModalComponent } from './driver-drugAlcohol-modal.component';

describe('DriverDrugAlcoholModalComponent', () => {
  let component: DriverDrugAlcoholModalComponent;
  let fixture: ComponentFixture<DriverDrugAlcoholModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DriverDrugAlcoholModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverDrugAlcoholModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
