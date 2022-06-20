import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckassistTableToolbarSwitchComponent } from './truckassist-table-toolbar-switch.component';

describe('TruckassistTableToolbarSwitchComponent', () => {
  let component: TruckassistTableToolbarSwitchComponent;
  let fixture: ComponentFixture<TruckassistTableToolbarSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TruckassistTableToolbarSwitchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckassistTableToolbarSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
