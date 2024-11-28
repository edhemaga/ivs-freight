import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaDocumentsDrawerComponent } from '@shared/components/ta-documents-drawer/ta-documents-drawer.component';

describe('TaDocumentsDrawerComponent', () => {
    let component: TaDocumentsDrawerComponent;
    let fixture: ComponentFixture<TaDocumentsDrawerComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TaDocumentsDrawerComponent],
        });
        fixture = TestBed.createComponent(TaDocumentsDrawerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
