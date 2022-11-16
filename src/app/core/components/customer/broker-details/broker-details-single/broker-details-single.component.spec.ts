import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerDetailsSingleComponent } from './broker-details-single.component';

describe('BrokerDetailsSingleComponent', () => {
   let component: BrokerDetailsSingleComponent;
   let fixture: ComponentFixture<BrokerDetailsSingleComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         declarations: [BrokerDetailsSingleComponent],
      }).compileComponents();
   });

   beforeEach(() => {
      fixture = TestBed.createComponent(BrokerDetailsSingleComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
