import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaUploadFilesNoSliderComponent } from '@shared/components/ta-upload-files-no-slider/ta-upload-files-no-slider.component';

describe('TaUploadFilesNoSliderComponent', () => {
    let component: TaUploadFilesNoSliderComponent;
    let fixture: ComponentFixture<TaUploadFilesNoSliderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaUploadFilesNoSliderComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TaUploadFilesNoSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
