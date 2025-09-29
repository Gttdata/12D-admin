import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NgxPrintModule } from 'ngx-print';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { MasterRoutingModule } from './master.routing.module';
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
import { ClassTeacherMappingComponent } from './components/class-teacher-mapping/class-teacher-mapping.component';
import { BoardMasterComponent } from './components/board-master/board-master.component';
import { MediumMasterComponent } from './components/medium-master/medium-master.component';
import { DivisionMasterComponent } from './components/division-master/division-master.component';
import { FeeHeadMasterAddComponent } from './components/Fee-Head-Master/FeeHeadMasterAdd/FeeHeadMasterAdd.component';
import { FeeHeadMasterListComponent } from './components/Fee-Head-Master/FeeHeadMasterList/FeeHeadMasterList.component';
import { BoardMediumMasterComponent } from './components/board-medium-master/board-medium-master.component';
import { SubscriptionMasterNewComponent } from './components/subscription-master-new/subscription-master-new.component';
import { CouponmasterComponent } from './components/couponmaster/couponmaster.component';
import { AnimationmasterComponent } from './components/Animation Master\'s/animationmaster/animationmaster.component';
import { AnimationDetailsComponent } from './components/Animation Master\'s/animation-details/animation-details.component';
import { AnimationRewardsComponent } from './components/Animation Master\'s/animation-rewards/animation-rewards.component';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { BannerMasterComponent } from './components/banner-master/banner-master.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
@NgModule({
  declarations: [
    MastersDashboardComponent,
    StatemasterlistComponent,
    ListYearMasterComponent,
    CountryMasterComponent,
    DistrictMasterComponent,
    CityMasterComponent,
    AdvertisementMasterComponent,
    AgeCateogaryComponent,
    SocialTaskMasterComponent,
    SocialTaskMappingComponent,
    SubscriptionMasterComponent,
    TaskTypeComponent,
    ALLTaskMasterComponent,
    ClassTeacherMappingComponent,
    BoardMasterComponent,
    MediumMasterComponent,
    DivisionMasterComponent,
    FeeHeadMasterAddComponent,
    FeeHeadMasterListComponent,
    BoardMediumMasterComponent,
    SubscriptionMasterNewComponent,
    CouponmasterComponent,
    AnimationmasterComponent,
    AnimationDetailsComponent,
    AnimationRewardsComponent,
    BannerMasterComponent,
  ],

  imports: [
    MasterRoutingModule,
    NzSliderModule,
    CommonModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    HttpClientModule,
    NzFormModule,
    NzInputModule,
    NzTableModule,
    NzDrawerModule,
    NzSpinModule,
    NzSelectModule,
    NzDropDownModule,
    NzIconModule,
    NzNotificationModule,
    NzButtonModule,
    NzSwitchModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzTreeSelectModule,
    NzRadioModule,
    NzDividerModule,
    NzTagModule,
    NzModalModule,
    NzPopoverModule,
    NzCheckboxModule,
    NzMessageModule,
    NzListModule,
    NzToolTipModule,
    NzAutocompleteModule,
    NzTimePickerModule,
    NzProgressModule,
    NzPopconfirmModule,
    NzBackTopModule,
    NzBadgeModule,
    NzAvatarModule,
    NzTypographyModule,
    NzTabsModule,
    NzTreeModule,
    ReactiveFormsModule,
    NzTimelineModule,
    NgxPrintModule,
    NzCarouselModule,
    DragDropModule,
    NzCardModule,
    NzImageModule,
    NzSpaceModule,
    AngularEditorModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'en' }],
})
export class MasterModule {}
