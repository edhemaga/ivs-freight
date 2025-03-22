import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaUnitInfoBoxComponent } from '@shared/components/ca-unit-info-box/ca-unit-info-box.component';

describe('CaUnitInfoBoxComponent', () => {
    let component: CaUnitInfoBoxComponent;
    let fixture: ComponentFixture<CaUnitInfoBoxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CaUnitInfoBoxComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CaUnitInfoBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
