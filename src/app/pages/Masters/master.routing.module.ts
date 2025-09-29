import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MastersDashboardComponent } from './masters-dashboard.component';
import { StatemasterlistComponent } from './components/StateMaster/statemasterlist.component';
import { ListYearMasterComponent } from './components/YearMaster/list-year-master.component';
import { CountryMasterComponent } from './components/country-master/country-master.component';
import { DistrictMasterComponent } from './components/district-master/district-master.component';
import { CityMasterComponent } from './components/city-master/city-master.component';
import { AdvertisementMasterComponent } from './components/advertisement-master/advertisement-master.component';
import { AgeCateogaryComponent } from './components/age-cateogary/age-cateogary.component';
import { SocialTaskMasterComponent } from './components/social-task-master/social-task-master.component';
import { SocialTaskMappingComponent } from './components/social-task-mapping/social-task-mapping.component';
import { SubscriptionMasterComponent } from './components/subscription-master/subscription-master.component';
import { TaskTypeComponent } from './components/task-type/task-type.component';
import { ALLTaskMasterComponent } from './components/alltask-master/alltask-master.component';
import { BoardMasterComponent } from './components/board-master/board-master.component';
import { MediumMasterComponent } from './components/medium-master/medium-master.component';
import { DivisionMasterComponent } from './components/division-master/division-master.component';
import { FeeHeadMasterListComponent } from './components/Fee-Head-Master/FeeHeadMasterList/FeeHeadMasterList.component';
import { BoardMediumMasterComponent } from './components/board-medium-master/board-medium-master.component';
import { SubscriptionUserMasterComponent } from './components/subscription-user-master/subscription-user-master.component';
import { SubscriptionMasterNewComponent } from './components/subscription-master-new/subscription-master-new.component';
import { CouponmasterComponent } from './components/couponmaster/couponmaster.component';
import { AnimationmasterComponent } from './components/Animation Master\'s/animationmaster/animationmaster.component';
import { BannerMasterComponent } from './components/banner-master/banner-master.component';

const routes: Routes = [
  {
    path: '',
    component: MastersDashboardComponent,
    children: [

      { path: 'countries', component: CountryMasterComponent },
      { path: 'cities', component: CityMasterComponent },
      { path: 'districts', component: DistrictMasterComponent },
      { path: 'states', component: StatemasterlistComponent },
      { path: 'agecategories', component: AgeCateogaryComponent },
      { path: 'years', component: ListYearMasterComponent },
      { path: 'advertisements', component: AdvertisementMasterComponent },
      { path: 'boards', component: BoardMasterComponent },
      { path: 'boardmediums', component: BoardMediumMasterComponent },
      { path: 'subscriptions', component: SubscriptionMasterNewComponent },
      { path: 'coupons', component: CouponmasterComponent },
      { path: 'animations', component: AnimationmasterComponent },

     // school login
     { path: 'mediums', component: MediumMasterComponent },
     { path: 'divisions', component: DivisionMasterComponent },
     { path: 'feeheads', component: FeeHeadMasterListComponent },
     { path: 'banner', component: BannerMasterComponent },
     

      // Dont Idea Abt Form
      { path: 'subscription', component: SubscriptionMasterComponent },
      { path: 'UserSubscription', component: SubscriptionUserMasterComponent },
       // 

      // Removed
      { path: 'socialtask', component: SocialTaskMasterComponent },
      {
        path: 'socialtask-Mapping',
        component: SocialTaskMappingComponent,
      },
      { path: 'alltask', component: ALLTaskMasterComponent },
      { path: 'tasktype', component: TaskTypeComponent },

      { path: '', pathMatch: 'full', redirectTo: 'schools' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRoutingModule {}
