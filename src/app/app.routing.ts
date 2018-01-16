// Child Components
import { AppRoutingModule } from './modules/app.routing.module';
import { AddTrainingComponent } from './add-training/add-training.component';
import { KeysPipe } from './pipes/keys.pipe';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TrainingComponent } from './training/training.component';
import { TrainingTitleComponent } from './training-title/training-title.component';
import { TrainingService } from './services/training.service';
import { MasterService } from './services/master.service';
import { PepfarOptionComponent } from './pepfar-option/pepfar-option.component';
import { TrainingTopicOptionComponent } from './training-topic-option/training-topic-option.component';
import { AlertComponent } from './alert/alert.component';
import { AlertService } from './services/alert.service';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { LoginService } from './services/login.service';
import { ApproveComponent } from './approve/approve.component';
import { PersonComponent } from './person/person.component';
import { PersonService } from './services/person.service';
import { AddPersonComponent } from './add-person/add-person.component';

export const AppRoutes: any = [
    { path: 'login', component: LoginComponent },
    { path: 'training', component: TrainingComponent },
    { path: 'addtraining', component: AddTrainingComponent },
    { path: 'person', component: PersonComponent},
    { path: 'addperson/:id', component: AddPersonComponent},
    { path: '',
      redirectTo: '/login',
      pathMatch: 'full'
    },
    { path: '**', component: PageNotFoundComponent }
];

export const AppComponents: any = [
    LoginComponent,
    PageNotFoundComponent,
    KeysPipe,
    AddTrainingComponent,
    TrainingComponent,
    TrainingTitleComponent,
    PepfarOptionComponent,
    TrainingTopicOptionComponent,
    AlertComponent,
    ConfirmModalComponent,
    ApproveComponent,
    PersonComponent,
    AddPersonComponent
];

export const AppEntryComponents: any = [
    TrainingTitleComponent,
    ConfirmModalComponent,
    AddTrainingComponent,
    AddPersonComponent
];

export const AppServices: any = [
    MasterService, TrainingService, AlertService, LoginService, PersonService
];

