import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoclosePopoverComponent } from './autoclose-popover.component';

describe('AutoclosePopoverComponent', () => {
  let component: AutoclosePopoverComponent;
  let fixture: ComponentFixture<AutoclosePopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutoclosePopoverComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoclosePopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
