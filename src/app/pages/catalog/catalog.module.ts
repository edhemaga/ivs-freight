import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { SharedModule } from '@shared/shared.module';
import { CatalogRoutingModule } from '@pages/catalog/catalog-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
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
