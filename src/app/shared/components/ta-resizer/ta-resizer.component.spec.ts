import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaResizerComponent } from '@shared/components/ta-resizer/ta-resizer.component';

describe('TaResizerComponent', () => {
    let component: TaResizerComponent;
    let fixture: ComponentFixture<TaResizerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaResizerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TaResizerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
