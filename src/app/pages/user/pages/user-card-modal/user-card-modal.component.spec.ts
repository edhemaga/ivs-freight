import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCardModalComponent } from '@pages/user/pages/user-card-modal/user-card-modal.component';

describe('UserCardModalComponent', () => {
  let component: UserCardModalComponent;
  let fixture: ComponentFixture<UserCardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCardModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
