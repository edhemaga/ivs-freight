import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaCommentsSearchComponent } from '@shared/components/ta-comments-search/ta-comments-search.component';

describe('TaCommentsSearchComponent', () => {
    let component: TaCommentsSearchComponent;
    let fixture: ComponentFixture<TaCommentsSearchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TaCommentsSearchComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TaCommentsSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
