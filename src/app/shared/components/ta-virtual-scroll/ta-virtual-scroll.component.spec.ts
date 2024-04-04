import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaVirtualScrollComponent } from './ta-virtual-scroll.component';

describe('TaVirtualScrollComponent', () => {
    let component: TaVirtualScrollComponent;
    let fixture: ComponentFixture<TaVirtualScrollComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TaVirtualScrollComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TaVirtualScrollComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
