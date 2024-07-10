import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDeatilsItemStopsMainComponent } from '@pages/load/pages/load-details/components/load-details-item/components/load-details-item-stops/components/load-deatils-item-stops-main/load-deatils-item-stops-main.component';

describe('LoadDeatilsItemStopsMainComponent', () => {
    let component: LoadDeatilsItemStopsMainComponent;
    let fixture: ComponentFixture<LoadDeatilsItemStopsMainComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoadDeatilsItemStopsMainComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LoadDeatilsItemStopsMainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
