import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDeatilsItemCommentsComponent } from '@pages/load/pages/load-details/components/load-details-item/components/load-deatils-item-comments/load-deatils-item-comments.component';

describe('LoadDeatilsItemCommentsComponent', () => {
    let component: LoadDeatilsItemCommentsComponent;
    let fixture: ComponentFixture<LoadDeatilsItemCommentsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoadDeatilsItemCommentsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LoadDeatilsItemCommentsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
