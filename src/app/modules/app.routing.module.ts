import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddTrainingComponent } from '../add-training/add-training.component';
import { LoginComponent } from '../login/login.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { TrainingComponent } from '../training/training.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'training', component: TrainingComponent },
  { path: 'addtraining', component: AddTrainingComponent },
  /* { path: 'hero/:id',      component: HeroDetailComponent }, */
 /*  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home' }
  }, */
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
