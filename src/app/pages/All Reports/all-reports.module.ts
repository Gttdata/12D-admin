import { NgModule } from '@angular/core';
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
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
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
import { NzSpaceModule } from 'ng-zorro-antd/space';

import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { AllReportsComponent } from './all-reports.component';
import { AllReportsManagementRoutingModule } from './all-reports.-routing.module';
import { ClasswiseFeeCollectionSummaryComponent } from './Components/classwise-fee-collection-summary/classwise-fee-collection-summary.component';
import { DetailedattendancereportComponent } from './Components/detailedattendancereport/detailedattendancereport.component';
import { ClasswiseHwCompletionDetailedReportComponent } from './Components/Super Admin Reports/classwise-hw-completion-detailed-report/classwise-hw-completion-detailed-report.component';
import { SchoolwiseTaskCreationDetailedReportComponent } from './Components/Super Admin Reports/schoolwise-task-creation-detailed-report/schoolwise-task-creation-detailed-report.component';
import { SchoolwisemembersummeryComponent } from './Components/Super Admin Reports/schoolwisemembersummery/schoolwisemembersummery.component';
import { SchoolwiseattendancetakenComponent } from './Components/Super Admin Reports/schoolwiseattendancetaken/schoolwiseattendancetaken.component';
import { UserreportsComponent } from './Components/userreports/userreports.component';
import { SubscriptionreportComponent } from './Components/subscriptionreport/subscriptionreport.component';
import { SubscriptionsummaryreportComponent } from './Components/subscriptionsummaryreport/subscriptionsummaryreport.component';
import { CouponcodeusagesummaryComponent } from './Components/couponcodeusagesummary/couponcodeusagesummary.component';
import { CouponcodeusagedetailedreportComponent } from './Components/couponcodeusagedetailedreport/couponcodeusagedetailedreport.component';
import { UserwisewhatsappmessagesreportComponent } from './Components/userwisewhatsappmessagesreport/userwisewhatsappmessagesreport.component';
import { UserwisemailreportComponent } from './Components/userwisemailreport/userwisemailreport.component';
import { UserwisenotificationreportComponent } from './Components/userwisenotificationreport/userwisenotificationreport.component';
import { WhatsappotpreportsComponent } from './Components/whatsappotpreports/whatsappotpreports.component';
import { CustomcreatedworkoutsreportsComponent } from './Components/customcreatedworkoutsreports/customcreatedworkoutsreports.component';
import { CustomcreatedsummaryreportsComponent } from './Components/customcreatedsummaryreports/customcreatedsummaryreports.component';
import { ActivityusesreportComponent } from './Components/activityusesreport/activityusesreport.component';
import { PrearrangeactivitysummaryreportComponent } from './Components/prearrangeactivitysummaryreport/prearrangeactivitysummaryreport.component';
import { UserbmireportComponent } from './Components/userbmireport/userbmireport.component';
import { PrearrangeactivitydetailedreportComponent } from './Components/prearrangeactivitydetailedreport/prearrangeactivitydetailedreport.component';
import { TrackbookpurchasehistoryComponent } from './Components/trackbookpurchasehistory/trackbookpurchasehistory.component';
import { UserwisequestionanswersComponent } from './Components/userwisequestionanswers/userwisequestionanswers.component';
import { TaskcompeltionsummaryComponent } from './Components/taskcompeltionsummary/taskcompeltionsummary.component';
import { UserwisetaskcompeltionComponent } from './Components/userwisetaskcompeltion/userwisetaskcompeltion.component';
import { UserwisetaskdetailedreportComponent } from './Components/userwisetaskdetailedreport/userwisetaskdetailedreport.component';
import { AnimationsummaryComponent } from './Components/animationsummary/animationsummary.component';
import { UseranimationdetailsComponent } from './Components/useranimationdetails/useranimationdetails.component';
import { UserrewarddetailsComponent } from './Components/userrewarddetails/userrewarddetails.component';
import { UseranimationcompletionComponent } from './Components/useranimationcompletion/useranimationcompletion.component';
import { PeriodreportComponent } from './Components/periodreport/periodreport.component';
import { PerioddetailedreportComponent } from './Components/perioddetailedreport/perioddetailedreport.component';
import { ContactusreportComponent } from './Components/contactusreport/contactusreport.component';
@NgModule({
  declarations: [
    AllReportsComponent,
    ClasswiseFeeCollectionSummaryComponent,
    DetailedattendancereportComponent,
    ClasswiseHwCompletionDetailedReportComponent,
    SchoolwiseTaskCreationDetailedReportComponent,
    SchoolwisemembersummeryComponent,
    SchoolwiseattendancetakenComponent,
    UserreportsComponent,
    SubscriptionreportComponent,
    SubscriptionsummaryreportComponent,
    CouponcodeusagesummaryComponent,
    CouponcodeusagedetailedreportComponent,
    UserwisewhatsappmessagesreportComponent,
    UserwisemailreportComponent,
    UserwisenotificationreportComponent,
    WhatsappotpreportsComponent,
    CustomcreatedworkoutsreportsComponent,
    CustomcreatedsummaryreportsComponent,
    ActivityusesreportComponent,
    PrearrangeactivitysummaryreportComponent,
    UserbmireportComponent,
    PrearrangeactivitydetailedreportComponent,
    TrackbookpurchasehistoryComponent,
    UserwisequestionanswersComponent,
    TaskcompeltionsummaryComponent,
    UserwisetaskcompeltionComponent,
    UserwisetaskdetailedreportComponent,
    AnimationsummaryComponent,
    UseranimationdetailsComponent,
    UserrewarddetailsComponent,
    UseranimationcompletionComponent,
    PeriodreportComponent,
    PerioddetailedreportComponent,
    ContactusreportComponent,
  ],
  imports: [
    CommonModule,
    AllReportsManagementRoutingModule,
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
    NzEmptyModule,
    NzStepsModule,
  ],
})
export class AllReportsManagement {}
