import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadStopItemsComponent } from './load-stop-items.component';

describe('LoadStopItemsComponent', () => {
  let component: LoadStopItemsComponent;
  let fixture: ComponentFixture<LoadStopItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadStopItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadStopItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
