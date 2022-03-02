import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationSubrouteCardComponent } from './navigation-card.component';

describe('NavigationSubrouteCardComponent', () => {
  let component: NavigationSubrouteCardComponent;
  let fixture: ComponentFixture<NavigationSubrouteCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigationSubrouteCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationSubrouteCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
