import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackBookComponent } from './track-Book.component';
import { TrackbookTasksComponent } from './Components/trackbook-tasks/trackbook-tasks.component';
import { DimensionmasterComponent } from './Components/dimensionmaster/dimensionmaster.component';
import { TrackbookquestionmasterComponent } from './Components/trackbookquestionmaster/trackbookquestionmaster.component';
import { Trackbookquesionmaster2Component } from './Components/trackbookquesionmaster2/trackbookquesionmaster2.component';
const routes: Routes = [
  {
    path: '',
    component: TrackBookComponent,
    children: [{ path: '', redirectTo: 'Task-management', pathMatch: 'full' },
    {
      path:'dimensions',component:DimensionmasterComponent
    },
    { path: 'trackbooktasks', component: TrackbookTasksComponent },
    //Old
    { path: 'trackbookquestionsold', component: TrackbookquestionmasterComponent },
    //New
    { path: 'trackbookquestions', component: Trackbookquesionmaster2Component },

    ],
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class  TrackBookRoutingModule { }
