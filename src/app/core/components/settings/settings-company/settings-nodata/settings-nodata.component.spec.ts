/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsNodataComponent } from './settings-nodata.component';

describe('SettingsNodataComponent', () => {
  let component: SettingsNodataComponent;
  let fixture: ComponentFixture<SettingsNodataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsNodataComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsNodataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
