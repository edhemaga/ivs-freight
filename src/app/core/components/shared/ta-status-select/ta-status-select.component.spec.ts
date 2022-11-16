import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaStatusSelectComponent } from './ta-status-select.component';

describe('TaStatusSelectComponent', () => {
    let component: TaStatusSelectComponent;
    let fixture: ComponentFixture<TaStatusSelectComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaStatusSelectComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaStatusSelectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
