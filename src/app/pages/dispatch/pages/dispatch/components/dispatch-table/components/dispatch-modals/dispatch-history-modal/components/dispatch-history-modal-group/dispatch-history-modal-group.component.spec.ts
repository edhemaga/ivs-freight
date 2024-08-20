import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchHistoryModalGroupComponent } from './dispatch-history-modal-group.component';

describe('DispatchHistoryModalGroupComponent', () => {
  let component: DispatchHistoryModalGroupComponent;
  let fixture: ComponentFixture<DispatchHistoryModalGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DispatchHistoryModalGroupComponent]
    });
    fixture = TestBed.createComponent(DispatchHistoryModalGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
