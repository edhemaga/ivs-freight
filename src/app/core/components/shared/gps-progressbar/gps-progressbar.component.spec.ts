import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsProgressbarComponent } from './gps-progressbar.component';

describe('GpsProgressbarComponent', () => {
  let component: GpsProgressbarComponent;
  let fixture: ComponentFixture<GpsProgressbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GpsProgressbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GpsProgressbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
