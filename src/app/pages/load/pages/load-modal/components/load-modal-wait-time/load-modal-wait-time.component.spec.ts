import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadModalWaitTimeComponent } from './load-modal-wait-time.component';

describe('LoadModalWaitTimeComponent', () => {
  let component: LoadModalWaitTimeComponent;
  let fixture: ComponentFixture<LoadModalWaitTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadModalWaitTimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadModalWaitTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
