import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckRegistrationModalComponent } from './truck-registration-modal.component';

describe('TruckRegistrationModalComponent', () => {
  let component: TruckRegistrationModalComponent;
  let fixture: ComponentFixture<TruckRegistrationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TruckRegistrationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckRegistrationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
