import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapMarkerDropdownComponent } from './map-marker-dropdown.component';

describe('MapMarkerDropdownComponent', () => {
  let component: MapMarkerDropdownComponent;
  let fixture: ComponentFixture<MapMarkerDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapMarkerDropdownComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapMarkerDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
