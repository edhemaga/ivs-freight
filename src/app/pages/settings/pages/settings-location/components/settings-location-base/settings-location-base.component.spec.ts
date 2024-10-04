import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsLocationBaseComponent } from '@pages/settings/pages/settings-location/components/settings-location-base/settings-location-base.component';

describe('SettingsLocationBaseComponent', () => {
  let component: SettingsLocationBaseComponent;
  let fixture: ComponentFixture<SettingsLocationBaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsLocationBaseComponent]
    });
    fixture = TestBed.createComponent(SettingsLocationBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
