import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelTableComponent } from './fuel-table.component';

describe('FuelTableComponent', () => {
  let component: FuelTableComponent;
  let fixture: ComponentFixture<FuelTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuelTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
