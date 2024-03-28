import { TrainingMaterialComponent } from './training-material.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: TrainingMaterialComponent }];

export const SettingsTrainingMaterial = RouterModule.forChild(routes);
