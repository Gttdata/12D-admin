import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { LoginComponent } from './Login/login/login.component';
import { AdminDashboardComponent } from './pages/Common/admin-dashboard/admin-dashboard.component';
import { FormsComponent } from './pages/Common/Forms/forms/forms.component';
import { RolesComponent } from './pages/Common/Roles/roles/roles.component';
import { UsersComponent } from './pages/Common/Users/users/users.component';
import { DashboardComponent } from './pages/Common/dashboard/dashboard.component';
import { HelpComponent } from './pages/HelpPage/help/help.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  // { path: 'login', redirectTo: 'login' },
  // { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  // { path: '', redirectTo: 'login', pathMatch: 'prefix' },
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UsersComponent },
  { path: 'roles', component: RolesComponent },
  { path: 'forms', component: FormsComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admindashboard', component: AdminDashboardComponent },
  { path: 'help1', component: HelpComponent },


  {
    path: 'masters',
    loadChildren: () =>
      import('./pages/Masters/master.module').then((m) => m.MasterModule),
  },
  {
    path: 'questionpaper',
    loadChildren: () =>
      import('./pages/Task Management/task-management.module').then(
        (m) => m.TaskManagementModule
      ),
  },
  {
    path: 'study-planner',
    loadChildren: () =>
      import('./pages/Study Planner/study-planner.module').then(
        (m) => m.StudyPlannerModule
      ),
  },

  {
    path: 'schoolerp',
    loadChildren: () =>
      import('./pages/School Management/school-management.module').then(
        (m) => m.SchoolManagementModule
      ),
  },
  {
    path: 'healthandfitness',
    loadChildren: () =>
      import('./pages/Health & Fitness, Masters/healthmasters.module').then(
        (m) => m.HealthMastersModule
      ),
  },

  {
    path: 'fit-books',
    loadChildren: () =>
      import('./pages/Fit-Book/fit-book.module').then((m) => m.FitBookModule),
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./pages/All Reports/all-reports.module').then(
        (m) => m.AllReportsManagement
      ),
  },
  {
    path: 'trackbook',
    loadChildren: () =>
      import('./pages/Track-Book/track-Book.module').then(
        (m) => m.TrackBookModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
