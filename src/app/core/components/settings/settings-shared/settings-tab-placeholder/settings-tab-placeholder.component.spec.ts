/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsTabPlaceholderComponent } from './settings-tab-placeholder.component';

describe('SettingsTabPlaceholderComponent', () => {
  let component: SettingsTabPlaceholderComponent;
  let fixture: ComponentFixture<SettingsTabPlaceholderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsTabPlaceholderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsTabPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
