import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckassistSearchComponent } from './truckassist-search.component';

describe('TruckassistSearchComponent', () => {
  let component: TruckassistSearchComponent;
  let fixture: ComponentFixture<TruckassistSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TruckassistSearchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckassistSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
