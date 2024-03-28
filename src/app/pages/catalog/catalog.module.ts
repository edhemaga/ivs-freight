// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { CatalogRoutingModule } from './catalog-routing.module';

// Components
import { CatalogComponent } from './catalog/catalog.component';

@NgModule({
    declarations: [CatalogComponent],
    imports: [CommonModule, SharedModule, CatalogRoutingModule],
})
export class CatalogModule {}
