import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaCustomDatetimePickersComponent } from '@shared/components/ta-custom-datetime-pickers/ta-custom-datetime-pickers.component';

describe('TaCustomDatetimePickersComponent', () => {
    let component: TaCustomDatetimePickersComponent;
    let fixture: ComponentFixture<TaCustomDatetimePickersComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaCustomDatetimePickersComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaCustomDatetimePickersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
