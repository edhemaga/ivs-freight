import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationSettingsComponent } from './navigation-settings.component';

describe('NavigationSettingsComponent', () => {
  let component: NavigationSettingsComponent;
  let fixture: ComponentFixture<NavigationSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigationSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
