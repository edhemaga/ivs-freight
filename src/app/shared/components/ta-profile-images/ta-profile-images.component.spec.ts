import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaProfileImagesComponent } from './ta-profile-images.component';

describe('TaProfileImagesComponent', () => {
    let component: TaProfileImagesComponent;
    let fixture: ComponentFixture<TaProfileImagesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaProfileImagesComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaProfileImagesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
