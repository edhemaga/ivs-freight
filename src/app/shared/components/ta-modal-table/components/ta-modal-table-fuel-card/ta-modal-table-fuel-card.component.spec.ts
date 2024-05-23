import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaModalTableFuelCardComponent } from './ta-modal-table-fuel-card.component';

describe('TaModalTableFuelCardComponent', () => {
  let component: TaModalTableFuelCardComponent;
  let fixture: ComponentFixture<TaModalTableFuelCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TaModalTableFuelCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaModalTableFuelCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
