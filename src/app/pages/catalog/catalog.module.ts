// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { CatalogRoutingModule } from './catalog-routing.module';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

// Components
import { CatalogSvgDefinitionsComponent } from '@pages/catalog/pages/catalog-svg-definitions/catalog-svg-definitions.component';

@NgModule({
    declarations: [CatalogSvgDefinitionsComponent],
    imports: [
        CommonModule,
        SharedModule,
        CatalogRoutingModule,
        FormsModule,
        AngularSvgIconModule,
    ],
})
export class CatalogModule {}
