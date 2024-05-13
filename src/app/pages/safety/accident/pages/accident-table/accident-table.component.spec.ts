import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentTableComponent } from '@pages/safety/accident/pages/accident-table/accident-table.component';

describe('AccidentTableComponent', () => {
    let component: AccidentTableComponent;
    let fixture: ComponentFixture<AccidentTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AccidentTableComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AccidentTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
