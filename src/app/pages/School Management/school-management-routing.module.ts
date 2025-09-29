import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchoolManagementComponent } from './school-management.component';
import { TaskMasterComponent } from './Components/TaskMaster/task-master.component';
import { ListTeacherMasterComponent } from './Components/TeacherMaster/list-teacher-master/list-teacher-master.component';
import { StudentfeedetailsComponent } from './Components/studentfeedetails/studentfeedetails.component';
import { QuestionmasterComponent } from './Components/questionmaster/questionmaster.component';
import { HolidaymasterComponent } from './Components/holidaymaster/holidaymaster.component';
import { StudenttaskdetailsComponent } from './Components/studenttaskdetails/studenttaskdetails.component';
import { ListschoolmasterComponent } from './Components/SchoolMaster/listschoolmaster/listschoolmaster.component';
import { ClassmasterComponent } from './Components/ClassMasterData/classmaster/classmaster.component';
import { StudentMasterComponent } from './Components/studentmastertable/student-master/student-master.component';

const routes: Routes = [
  {
    path: '',
    component: SchoolManagementComponent,
    children: [
      { path: 'classwisetasks', component: TaskMasterComponent },
      { path: 'school_registration', component: ListschoolmasterComponent },
      { path: 'teachers', component: ListTeacherMasterComponent },
      {
        path: 'studentfeedetails',
        component: StudentfeedetailsComponent,
      },
      { path: 'holidays', component: HolidaymasterComponent },
      { path: 'students', component: StudentMasterComponent },
      { path: 'classes', component: ClassmasterComponent },
      { path: 'studenttask', component: StudenttaskdetailsComponent },


      // Removed
      { path: 'question-master', component: QuestionmasterComponent },



      { path: '', redirectTo: 'list-tasks', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SchoolManagementRoutingModule {}
