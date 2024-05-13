/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentModalComponent } from '@pages/safety/accident/pages/accident-modal/accident-modal.component';

describe('AccidentModalComponent', () => {
    let component: AccidentModalComponent;
    let fixture: ComponentFixture<AccidentModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AccidentModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AccidentModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
