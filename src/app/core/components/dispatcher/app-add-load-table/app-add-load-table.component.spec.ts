import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAddLoadTableComponent } from './app-add-load-table.component';

describe('AppAddLoadTableComponent', () => {
   let component: AppAddLoadTableComponent;
   let fixture: ComponentFixture<AppAddLoadTableComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [AppAddLoadTableComponent],
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(AppAddLoadTableComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
