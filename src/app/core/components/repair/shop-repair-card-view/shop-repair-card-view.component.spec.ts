import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopRepairCardViewComponent } from './shop-repair-card-view.component';

describe('ShopRepairCardViewComponent', () => {
   let component: ShopRepairCardViewComponent;
   let fixture: ComponentFixture<ShopRepairCardViewComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         declarations: [ShopRepairCardViewComponent],
      }).compileComponents();
   });

   beforeEach(() => {
      fixture = TestBed.createComponent(ShopRepairCardViewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
