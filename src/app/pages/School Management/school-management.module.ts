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
import { SchoolManagementComponent } from './school-management.component';
import { SchoolManagementRoutingModule } from './school-management-routing.module';
import { ListschoolmasterComponent } from './Components/SchoolMaster/listschoolmaster/listschoolmaster.component';
import { TaskMasterComponent } from './Components/TaskMaster/task-master.component';
import { AddschoolmasterComponent } from './Components/SchoolMaster/addschoolmaster/addschoolmaster.component';
import { ListTeacherMasterComponent } from './Components/TeacherMaster/list-teacher-master/list-teacher-master.component';
import { AddTeacherMasterComponent } from './Components/TeacherMaster/add-teacher-master/add-teacher-master.component';
import { StudentfeedetailsComponent } from './Components/studentfeedetails/studentfeedetails.component';
import { QuestionmasterComponent } from './Components/questionmaster/questionmaster.component';
import { PromotedstudentComponent } from './Components/ClassMasterData/promotedstudent/promotedstudent.component';
import { ClassmasterComponent } from './Components/ClassMasterData/classmaster/classmaster.component';
import { StudenttaskdetailsComponent } from './Components/studenttaskdetails/studenttaskdetails.component';
import { StudentMasterComponent } from './Components/studentmastertable/student-master/student-master.component';
import { StudentFormComponent } from './Components/studentmastertable/student-form/student-form.component';
import { HolidaymasterComponent } from './Components/holidaymaster/holidaymaster.component';
import { MapFeeComponent } from './Components/ClassMasterData/MapFee/MapFee.component';
import { StudentWiseFeeMapComponent } from './Components/studentmastertable/StudentWiseFeeMap/StudentWiseFeeMap.component';
import { MapTeacherComponent } from './Components/ClassMasterData/map-teacher/map-teacher.component';

@NgModule({
  declarations: [
    SchoolManagementComponent,
    TaskMasterComponent,
    ListschoolmasterComponent,
    AddschoolmasterComponent,
    ListTeacherMasterComponent,
    AddTeacherMasterComponent,
    StudenttaskdetailsComponent,
    QuestionmasterComponent,
    StudentMasterComponent,
    StudentFormComponent,
    StudentfeedetailsComponent,
    HolidaymasterComponent,
    ClassmasterComponent,
    PromotedstudentComponent,
    MapFeeComponent,
    StudentWiseFeeMapComponent,
    MapTeacherComponent
  ],
  imports: [
    CommonModule,
    SchoolManagementRoutingModule,
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
    NzProgressModule
  ],
  exports: [
    AddschoolmasterComponent
  ]
})
export class SchoolManagementModule {}
