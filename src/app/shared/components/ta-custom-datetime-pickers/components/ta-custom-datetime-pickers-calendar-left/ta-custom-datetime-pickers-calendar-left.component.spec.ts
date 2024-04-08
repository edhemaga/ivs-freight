import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaCustomDateTimePickersCalendarLeftComponent } from './ta-custom-datetime-pickers-calendar-left.component';

describe('TaCustomDateTimePickersCalendarLeftComponent', () => {
    let component: TaCustomDateTimePickersCalendarLeftComponent;
    let fixture: ComponentFixture<TaCustomDateTimePickersCalendarLeftComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaCustomDateTimePickersCalendarLeftComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(
            TaCustomDateTimePickersCalendarLeftComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
