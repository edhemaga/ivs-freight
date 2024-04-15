import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogSvgDefinitionsComponent } from '@pages/catalog/pages/catalog-svg-definitions/catalog-svg-definitions.component';

describe('CatalogSvgDefinitionsComponent', () => {
    let component: CatalogSvgDefinitionsComponent;
    let fixture: ComponentFixture<CatalogSvgDefinitionsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CatalogSvgDefinitionsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CatalogSvgDefinitionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
