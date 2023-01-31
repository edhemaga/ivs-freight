import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierSearchComponent } from './carrier-search.component';

describe('CarrierSearchComponent', () => {
  let component: CarrierSearchComponent;
  let fixture: ComponentFixture<CarrierSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CarrierSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarrierSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
