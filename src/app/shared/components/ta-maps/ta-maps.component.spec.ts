import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaMapsComponent } from '@shared/components/ta-maps/ta-maps.component';

describe('TaMapsComponent', () => {
    let component: TaMapsComponent;
    let fixture: ComponentFixture<TaMapsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaMapsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaMapsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
