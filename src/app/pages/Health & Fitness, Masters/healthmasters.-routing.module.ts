import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HealthmastersComponent } from './healthmasters.component';
import { ActivityHeadMasterComponent } from './Components/activity-head-master/activity-head-master.component';
import { ActivityMasterComponent } from './Components/activity-master/activity-master.component';
import { ActivitycategorymasterComponent } from './Components/activitycategorymaster/activitycategorymaster.component';

const routes: Routes = [
  {
    path: '',
    component: HealthmastersComponent,
    children: [{ path: '', redirectTo: 'health-management', pathMatch: 'full' }],
  },
  {
    path:'activityheads',component:ActivityHeadMasterComponent
  },
  {
    path:'activities',component:ActivityMasterComponent
  },
  {
    path:'activitycategory',component:ActivitycategorymasterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HealthMastersRoutingModule {}
