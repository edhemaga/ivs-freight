/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsToollbarCardComponent } from './settings-toollbar-card.component';

describe('SettingsToollbarCardComponent', () => {
  let component: SettingsToollbarCardComponent;
  let fixture: ComponentFixture<SettingsToollbarCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsToollbarCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsToollbarCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
