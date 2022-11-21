/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsParkingComponent } from './settings-parking.component';

describe('SettingsParkingComponent', () => {
  let component: SettingsParkingComponent;
  let fixture: ComponentFixture<SettingsParkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsParkingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsParkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
