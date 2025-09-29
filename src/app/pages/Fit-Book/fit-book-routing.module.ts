import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FitBookComponent } from './fit-book.component';
import { FitBooksComponent } from './Components/fit-book/fit-book.component';

const routes: Routes = [
  {
    path: '',
    component: FitBookComponent,
    children: [
      { path: 'list-fitbook', component: FitBooksComponent },
      { path: '', redirectTo: 'list-fitbook', pathMatch: 'full' },

  ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FitBookRoutingModule {}
