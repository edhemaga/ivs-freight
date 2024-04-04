import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaFilterComponent } from './ta-filter.component';

describe('TaFilterComponent', () => {
    let component: TaFilterComponent;
    let fixture: ComponentFixture<TaFilterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaFilterComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaFilterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
