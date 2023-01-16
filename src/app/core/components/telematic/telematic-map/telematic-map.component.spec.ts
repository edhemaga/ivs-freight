import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelematicMapComponent } from './telematic-map.component';

describe('TelematicMapComponent', () => {
  let component: TelematicMapComponent;
  let fixture: ComponentFixture<TelematicMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelematicMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TelematicMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
