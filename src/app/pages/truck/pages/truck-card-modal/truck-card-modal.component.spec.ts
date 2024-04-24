import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckCardModalComponent } from './truck-card-modal.component';

describe('TruckCardModalComponent', () => {
  let component: TruckCardModalComponent;
  let fixture: ComponentFixture<TruckCardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TruckCardModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TruckCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
