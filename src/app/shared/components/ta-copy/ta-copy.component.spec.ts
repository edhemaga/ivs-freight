import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaCopyComponent } from './ta-copy.component';

describe('TaCopyComponent', () => {
    let component: TaCopyComponent;
    let fixture: ComponentFixture<TaCopyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaCopyComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaCopyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
