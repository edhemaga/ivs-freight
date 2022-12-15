import { NameInitialsPipe } from './../../../pipes/nameinitials';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProfileImagesComponent } from './profile-images.component';
import { AppTooltipeModule } from '../app-tooltip/app-tooltip.module';
@NgModule({
    declarations: [ProfileImagesComponent, NameInitialsPipe],
    exports: [ProfileImagesComponent],
    imports: [CommonModule, AppTooltipeModule],
    providers: [NameInitialsPipe],
})
export class ProfileImagesModule {}
