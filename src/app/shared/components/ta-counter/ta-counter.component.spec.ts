/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';

describe('TaCounterComponent', () => {
    let component: TaCounterComponent;
    let fixture: ComponentFixture<TaCounterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaCounterComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaCounterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
