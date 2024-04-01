import { TrainingMaterialComponent } from '../pages/training-material/training-material.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: TrainingMaterialComponent }];

export const SettingsTrainingMaterial = RouterModule.forChild(routes);
