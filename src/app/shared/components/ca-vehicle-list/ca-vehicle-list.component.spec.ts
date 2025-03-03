import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaVehicleListComponent } from './ca-vehicle-list.component';

describe('CaVehicleListComponent', () => {
  let component: CaVehicleListComponent;
  let fixture: ComponentFixture<CaVehicleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaVehicleListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaVehicleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
