import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskManagementComponent } from './task-management.component';
import { SubjectmasterComponent } from './Components/School Task Management/subjectmaster/subjectmaster.component';
import { ChapterMasterComponent } from './Components/School Task Management/chapter-master/chapter-master.component';
import { QuestiontypeComponent } from './Components/School Task Management/questiontype/questiontype.component';
import { QuestionMasterListComponent } from './Components/School Task Management/QuestionMaster/question-master-list/question-master-list.component';
import { QuestionMasterImportComponent } from './Components/School Task Management/question-master-import/question-master-import.component';
import { ListBulkTaskComponent } from './Components/App Task Management/TrackkTaskMaster/list-bulk-task/list-bulk-task.component'; 
import { QuestionPaperClassComponent } from './Components/School Task Management/question-paper-class/question-paper-class.component';
import { QuestionsubjectComponent } from './Components/School Task Management/questionsubject/questionsubject.component';



const routes: Routes = [
  {
    path: '',
    component: TaskManagementComponent,
    children: [{ path: '', redirectTo: 'questionpaper', pathMatch: 'full' },

    // school login
    { path: 'subjects', component: SubjectmasterComponent },

    // admin login
    { path: 'chapters', component: ChapterMasterComponent },
    { path: 'questiontypes', component: QuestiontypeComponent },
    { path: 'questions', component: QuestionMasterListComponent },
    { path: 'questionsimports', component: QuestionMasterImportComponent },
    
    { path: 'questionpapers', component: QuestionPaperClassComponent },
    { path: 'questionsubjects', component: QuestionsubjectComponent },

    // removed 

    { path: 'bulktasks', component: ListBulkTaskComponent },



    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskManagementRoutingModule { }
