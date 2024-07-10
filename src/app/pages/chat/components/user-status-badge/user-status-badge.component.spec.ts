import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStatusBadgeComponent } from '@pages/chat/components/user-status-badge/user-status-badge.component';

describe('UserStatusBadgeComponent', () => {
  let component: UserStatusBadgeComponent;
  let fixture: ComponentFixture<UserStatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserStatusBadgeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserStatusBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
