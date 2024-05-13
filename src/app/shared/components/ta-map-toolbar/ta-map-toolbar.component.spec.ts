import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaMapToolbarComponent } from '@shared/components/ta-map-toolbar/ta-map-toolbar.component';

describe('TaMapToolbarComponent', () => {
    let component: TaMapToolbarComponent;
    let fixture: ComponentFixture<TaMapToolbarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaMapToolbarComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaMapToolbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
