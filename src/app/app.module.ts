import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { DatePipe } from '@angular/common';
// import { LoginComponent } from './Login/login/login.component';
import { LoginComponent } from './login/login.component';
import { FormComponent } from './pages/Common/Forms/form/form.component';
import { FormsComponent } from './pages/Common/Forms/forms/forms.component';
import { RoleComponent } from './pages/Common/Roles/role/role.component';
import { RoledetailsComponent } from './pages/Common/Roles/roledetails/roledetails.component';
import { RolesComponent } from './pages/Common/Roles/roles/roles.component';
import { UserComponent } from './pages/Common/Users/user/user.component';
import { UsersComponent } from './pages/Common/Users/users/users.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { ExportDirective } from './directives/export.directive';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AdminDashboardComponent } from './pages/Common/admin-dashboard/admin-dashboard.component';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NgxPrintModule } from 'ngx-print';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzStepsModule } from "ng-zorro-antd/steps";
import { SchoolManagementModule } from './pages/School Management/school-management.module';
import { StudentDetailsReportComponent } from './pages/All Reports/Components/student-details-report/student-details-report.component';
import { TeacherDetailsReportComponent } from './pages/All Reports/Components/teacher-details-report/teacher-details-report.component';
import { StudentfeeDetailsReportComponent } from './pages/All Reports/Components/studentfee-details-report/studentfee-details-report.component';
import { ClasswiseAttendanceReportComponent } from './pages/All Reports/Components/classwise-attendance-report/classwise-attendance-report.component';
import { ClasswiseTaskDetailsReportComponent } from './pages/All Reports/Components/classwise-task-details-report/classwise-task-details-report.component';
import { AllreporttilesComponent } from './pages/All Reports/Components/allreporttiles/allreporttiles.component';
import { HelpComponent } from './pages/HelpPage/help/help.component';
import { SubscriptionUserMasterComponent } from './pages/Masters/components/subscription-user-master/subscription-user-master.component';
import { NzImageModule } from 'ng-zorro-antd/image';
import { Trackbookquesionmaster2Component } from './pages/Track-Book/Components/trackbookquesionmaster2/trackbookquesionmaster2.component';
import { AngularEditorModule } from '@kolkov/angular-editor';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UserComponent,
    RolesComponent,
    RoleComponent,
    FormComponent,
    FormsComponent,
    RoledetailsComponent,
    ExportDirective,
    AdminDashboardComponent,
    StudentDetailsReportComponent,
    TeacherDetailsReportComponent,
    StudentfeeDetailsReportComponent,
    ClasswiseAttendanceReportComponent,
    ClasswiseTaskDetailsReportComponent,
    AllreporttilesComponent,
    HelpComponent,
    LoginComponent,
    SubscriptionUserMasterComponent,
  ],

  imports: [
    NzImageModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzDrawerModule,
    NzNotificationModule,
    NzSpinModule,
    NzTableModule,
    NzInputModule,
    NzSwitchModule,
    NzFormModule,
    NzButtonModule,
    NzIconModule,
    NzDropDownModule,
    NzSelectModule,
    NzDatePickerModule,
    NzToolTipModule,
    NzCardModule,
    NzSpaceModule,
    NzModalModule,
    NzTimelineModule,
    NzEmptyModule,
    NzCheckboxModule,
    Ng2GoogleChartsModule,
    NgApexchartsModule,
    NzTimePickerModule,
    NzInputNumberModule,
    NzTabsModule,
    NzDividerModule,
    NzPopconfirmModule,
    NzTagModule,
    NzAutocompleteModule,
    NzCollapseModule,
    NzRadioModule,
    NgxPrintModule,
    NzBadgeModule,
    NzStepsModule,
    SchoolManagementModule,
    AngularEditorModule
  ],

  providers: [{ provide: NZ_I18N, useValue: en_US }, DatePipe],
  bootstrap: [AppComponent]
})

export class AppModule { }
