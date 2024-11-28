import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelCardModalComponent } from '@pages/fuel/pages/fuel-card-modal/fuel-card-modal.component';

describe('FuelCardModalComponent', () => {
  let component: FuelCardModalComponent;
  let fixture: ComponentFixture<FuelCardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuelCardModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuelCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
