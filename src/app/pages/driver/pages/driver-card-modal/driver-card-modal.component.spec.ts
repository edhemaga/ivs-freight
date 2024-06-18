import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverCardModalComponent } from '@pages/driver/pages/driver-card-modal/driver-card-modal.component';

describe('DriverCardModalComponent', () => {
  let component: DriverCardModalComponent;
  let fixture: ComponentFixture<DriverCardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverCardModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
