import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationUserProfileComponent } from './navigation-user-profile.component';

describe('NavigationUserProfileComponent', () => {
  let component: NavigationUserProfileComponent;
  let fixture: ComponentFixture<NavigationUserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigationUserProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
