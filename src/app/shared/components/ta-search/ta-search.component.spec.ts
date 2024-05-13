import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaSearchComponent } from '@shared/components/ta-search/ta-search.component';

describe('TaSearchComponent', () => {
    let component: TaSearchComponent;
    let fixture: ComponentFixture<TaSearchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TaSearchComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TaSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
