import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaNoteComponent } from './ta-note.component';

describe('TaNoteComponent', () => {
   let component: TaNoteComponent;
   let fixture: ComponentFixture<TaNoteComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [TaNoteComponent],
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(TaNoteComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
