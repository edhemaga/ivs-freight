import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaGpsProgressbarComponent } from './ta-gps-progressbar.component';

describe('TaGpsProgressbarComponent', () => {
    let component: TaGpsProgressbarComponent;
    let fixture: ComponentFixture<TaGpsProgressbarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaGpsProgressbarComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaGpsProgressbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
