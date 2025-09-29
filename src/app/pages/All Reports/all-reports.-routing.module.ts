import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllReportsComponent } from './all-reports.component';
import { StudentDetailsReportComponent } from './Components/student-details-report/student-details-report.component';
import { TeacherDetailsReportComponent } from './Components/teacher-details-report/teacher-details-report.component';
import { StudentfeeDetailsReportComponent } from './Components/studentfee-details-report/studentfee-details-report.component';
import { ClasswiseAttendanceReportComponent } from './Components/classwise-attendance-report/classwise-attendance-report.component';
import { ClasswiseTaskDetailsReportComponent } from './Components/classwise-task-details-report/classwise-task-details-report.component';
import { AllreporttilesComponent } from './Components/allreporttiles/allreporttiles.component';
import { ClasswiseFeeCollectionSummaryComponent } from './Components/classwise-fee-collection-summary/classwise-fee-collection-summary.component';
import { DetailedattendancereportComponent } from './Components/detailedattendancereport/detailedattendancereport.component';
import { ClasswiseHwCompletionDetailedReportComponent } from './Components/Super Admin Reports/classwise-hw-completion-detailed-report/classwise-hw-completion-detailed-report.component';
import { SchoolwiseTaskCreationDetailedReportComponent } from './Components/Super Admin Reports/schoolwise-task-creation-detailed-report/schoolwise-task-creation-detailed-report.component';
import { SchoolwiseattendancetakenComponent } from './Components/Super Admin Reports/schoolwiseattendancetaken/schoolwiseattendancetaken.component';
import { SchoolwisemembersummeryComponent } from './Components/Super Admin Reports/schoolwisemembersummery/schoolwisemembersummery.component';
import { UserreportsComponent } from './Components/userreports/userreports.component';
import { SubscriptionreportComponent } from './Components/subscriptionreport/subscriptionreport.component';
import { SubscriptionsummaryreportComponent } from './Components/subscriptionsummaryreport/subscriptionsummaryreport.component';
import { CouponcodeusagesummaryComponent } from './Components/couponcodeusagesummary/couponcodeusagesummary.component';
import { CouponcodeusagedetailedreportComponent } from './Components/couponcodeusagedetailedreport/couponcodeusagedetailedreport.component';
import { UserwisewhatsappmessagesreportComponent } from './Components/userwisewhatsappmessagesreport/userwisewhatsappmessagesreport.component';
import { UserwisenotificationreportComponent } from './Components/userwisenotificationreport/userwisenotificationreport.component';
import { UserwisemailreportComponent } from './Components/userwisemailreport/userwisemailreport.component';
import { WhatsappotpreportsComponent } from './Components/whatsappotpreports/whatsappotpreports.component';
import { CustomcreatedworkoutsreportsComponent } from './Components/customcreatedworkoutsreports/customcreatedworkoutsreports.component';
import { CustomcreatedsummaryreportsComponent } from './Components/customcreatedsummaryreports/customcreatedsummaryreports.component';
import { ActivityusesreportComponent } from './Components/activityusesreport/activityusesreport.component';
import { PrearrangeactivitysummaryreportComponent } from './Components/prearrangeactivitysummaryreport/prearrangeactivitysummaryreport.component';
import { UserbmireportComponent } from './Components/userbmireport/userbmireport.component';
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
import { PrearrangeactivitydetailedreportComponent } from './Components/prearrangeactivitydetailedreport/prearrangeactivitydetailedreport.component';
import { TrackbookpurchasehistoryComponent } from './Components/trackbookpurchasehistory/trackbookpurchasehistory.component';
import { ContactusreportComponent } from './Components/contactusreport/contactusreport.component';
const routes: Routes = [
  {
    path: '',
    component: AllReportsComponent,
    children: [
      { path: '', redirectTo: 'all-reports-management', pathMatch: 'full' },
    ],
  },

  //ERP Reports
  {
    path: 'studentdetailsreport',
    component: StudentDetailsReportComponent,
  },
  {
    path: 'teacherdetailsreport',
    component: TeacherDetailsReportComponent,
  },
  {
    path: 'studentfeesdetailsreport',
    component: StudentfeeDetailsReportComponent,
  },
  {
    path: 'classwiseattendancereport',
    component: ClasswiseAttendanceReportComponent,
  },
  {
    path: 'classwisetaskdetailsreport',
    component: ClasswiseTaskDetailsReportComponent,
  },
  {
    path: 'classwisefeesummaryreport',
    component: ClasswiseFeeCollectionSummaryComponent,
  },
  {
    path: 'attendancedetailedreport',
    component: DetailedattendancereportComponent,
  },
  {
    path: 'viewreports',
    component: AllreporttilesComponent,
  },
  {
    path: 'classwsiehwcompletiondetailedreport',
    component: ClasswiseHwCompletionDetailedReportComponent,
  },
  {
    path: 'schoolwisetaskcreationdetailedreport',
    component: SchoolwiseTaskCreationDetailedReportComponent,
  },
  {
    path: 'schoolattendancecount',
    component: SchoolwiseattendancetakenComponent,
  },
  {
    path: 'schoolmembersummary',
    component: SchoolwisemembersummeryComponent,
  },

  // Regular Reports
  {
    path: 'usersreport',
    component: UserreportsComponent,
  },
  {
    path: 'subscriptiondetailedreport',
    component: SubscriptionreportComponent,
  },
  {
    path: 'subscriptionsummaryreport',
    component: SubscriptionsummaryreportComponent,
  },
  {
    path: 'couponcodeusagesummaryreport',
    component: CouponcodeusagesummaryComponent,
  },
  {
    path: 'couponcodeusagedetailedreport',
    component: CouponcodeusagedetailedreportComponent,
  },
  {
    path: 'userwisewhatsappmessagesreport',
    component: UserwisewhatsappmessagesreportComponent,
  },
  {
    path: 'userwisenotificationreport',
    component: UserwisenotificationreportComponent,
  },
  {
    path: 'userwisemailreport',
    component: UserwisemailreportComponent,
  },
  {
    path: 'whatsappotpreport',
    component: WhatsappotpreportsComponent,
  },
  {
    path: 'customcreatedworkoutreport',
    component: CustomcreatedworkoutsreportsComponent,
  },
  {
    path: 'customcreatedworkoutsummaryreport',
    component: CustomcreatedsummaryreportsComponent,
  },
  {
    path: 'activityusesreport',
    component: ActivityusesreportComponent,
  },
  {
    path: 'prearrangeactivitysummaryreport',
    component: PrearrangeactivitysummaryreportComponent,
  },
  {
    path: 'usersbmireport',
    component: UserbmireportComponent,
  },
  {
    path: 'userwisequestionandanswers',
    component: UserwisequestionanswersComponent,
  },
  {
    path: 'taskcompletionsummaryreport',
    component: TaskcompeltionsummaryComponent,
  },
  {
    path: 'userwisetaskcompletionsummaryreport',
    component: UserwisetaskcompeltionComponent,
  },
  {
    path: 'userwisetaskcompletiondetailedreport',
    component: UserwisetaskdetailedreportComponent,
  },
  {
    path: 'animationreport',
    component: AnimationsummaryComponent,
  },
  {
    path: 'userwiseanimationdetailedreport',
    component: UseranimationdetailsComponent,
  },
  {
    path: 'userwiserewarddetailedreport',
    component: UserrewarddetailsComponent,
  },
  {
    path: 'userwieanimationcompletionreport',
    component: UseranimationcompletionComponent,
  },
  {
    path: 'periodsummaryreport',
    component: PeriodreportComponent,
  },
  {
    path: 'perioddetailedreport',
    component: PerioddetailedreportComponent,
  },
  {
    path: 'prearrangeactivitydetailedreport',
    component: PrearrangeactivitydetailedreportComponent,
  },
  {
    path: 'tracbooktasksummaryreport',
    component: TrackbookpurchasehistoryComponent,
  },
  {
    path: 'contactusreport',
    component: ContactusreportComponent,
  },
  // {  path: 'schoolattendancecount', component: SchoolwiseattendancetakenComponent  },
  // {  path: 'schoolMemberSummary', component: SchoolwisemembersummeryComponent  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllReportsManagementRoutingModule {}
