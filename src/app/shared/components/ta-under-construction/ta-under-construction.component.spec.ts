import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaUnderConstructionComponent } from '@shared/components/ta-under-construction/ta-under-construction.component';

describe('TaUnderConstructionComponent', () => {
    let component: TaUnderConstructionComponent;
    let fixture: ComponentFixture<TaUnderConstructionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaUnderConstructionComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaUnderConstructionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
