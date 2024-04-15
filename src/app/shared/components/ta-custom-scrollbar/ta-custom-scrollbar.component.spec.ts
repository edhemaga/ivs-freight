import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaCustomScrollbarComponent } from '@shared/components/ta-custom-scrollbar/ta-custom-scrollbar.component';

describe('TaCustomScrollbarComponent', () => {
    let component: TaCustomScrollbarComponent;
    let fixture: ComponentFixture<TaCustomScrollbarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaCustomScrollbarComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaCustomScrollbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
