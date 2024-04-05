import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaCalendarDatesMainComponent } from './ta-calendar-dates-main.component';

describe('TaCalendarDatesMainComponent', () => {
    let component: TaCalendarDatesMainComponent;
    let fixture: ComponentFixture<TaCalendarDatesMainComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaCalendarDatesMainComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaCalendarDatesMainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
