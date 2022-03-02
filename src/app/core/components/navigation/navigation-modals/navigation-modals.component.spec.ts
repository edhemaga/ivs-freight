import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationModalsComponent } from './navigation-modals.component';

describe('NavigationModalsComponent', () => {
  let component: NavigationModalsComponent;
  let fixture: ComponentFixture<NavigationModalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigationModalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
