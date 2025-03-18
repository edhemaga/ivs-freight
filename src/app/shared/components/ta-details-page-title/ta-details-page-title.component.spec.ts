import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaDetailsPageTitleComponent } from '@shared/components/ta-details-page-title/ta-details-page-title.component';

describe('TaDetailsPageTitleComponent', () => {
    let component: TaDetailsPageTitleComponent;
    let fixture: ComponentFixture<TaDetailsPageTitleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TaDetailsPageTitleComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TaDetailsPageTitleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
