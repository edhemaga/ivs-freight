import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopRepairDetailsComponent } from './shop-repair-details.component';

describe('ShopRepairDetailsComponent', () => {
  let component: ShopRepairDetailsComponent;
  let fixture: ComponentFixture<ShopRepairDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopRepairDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopRepairDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
