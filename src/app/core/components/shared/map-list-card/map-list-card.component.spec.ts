import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapListCardComponent } from './map-list-card.component';

describe('MapListCardComponent', () => {
  let component: MapListCardComponent;
  let fixture: ComponentFixture<MapListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapListCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
