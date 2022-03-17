import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckassistProgressExpirationComponent } from './truckassist-progress-expiration.component';

describe('TruckassistProgressExpirationComponent', () => {
  let component: TruckassistProgressExpirationComponent;
  let fixture: ComponentFixture<TruckassistProgressExpirationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TruckassistProgressExpirationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckassistProgressExpirationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
