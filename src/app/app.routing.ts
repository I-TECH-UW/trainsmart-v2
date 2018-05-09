// Child Components
import { Routes } from '@angular/router';
import { AddTrainingComponent } from './add-training/add-training.component';
import { KeysPipe } from './pipes/keys.pipe';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TrainingComponent } from './training/training.component';
import { TrainingTitleComponent } from './training-title/training-title.component';
import { PepfarOptionComponent } from './pepfar-option/pepfar-option.component';
import { TrainingTopicOptionComponent } from './training-topic-option/training-topic-option.component';
import { AlertComponent } from './alert/alert.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { ApproveComponent } from './approve/approve.component';
import { PersonComponent } from './person/person.component';
import { AddPersonComponent } from './add-person/add-person.component';
import { AddPersonGeneralComponent } from './add-person/partials/add-person-general/add-person-general.component';
import { AddPersonContactComponent } from './add-person/partials/add-person-contact/add-person-contact.component';
import { AddPersonQualificationComponent } from './add-person/partials/add-person-qualification/add-person-qualification.component';
import { AddTrainingGeneralComponent } from './add-training/partials/add-training-general/add-training-general.component';
import { AddTrainingParticipantComponent } from './add-training/partials/add-training-participant/add-training-participant.component';
import { AddTrainingTrainerComponent } from './add-training/partials/add-training-trainer/add-training-trainer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CertificateComponent } from './certificate/certificate.component';
import { ScoreComponent } from './score/score.component';
import { CompleteTrainingComponent } from './complete-training/complete-training.component';
import { ShowErrorsComponent } from './show-errors/show-errors.component';
import { CustomValidators } from './validators/custom-validators';
import { TimelineComponent } from './timeline/timeline.component';
import { CertifyComponent } from './certify/certify.component';
import { 
    AuthGuard,
    AlertService, 
    AuthenticationService, 
    JwtService,
    LoginService,
    MasterService,
    PersonService,
    ReportService,
    SharedService,
    TrainingService,
    UserService,
    CertGuard,
    ApiService,
    PersonResolver,
    TrainingResolver
} from './shared';
import { ActivityReportComponent } from './reports/activity-report/activity-report.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { TrainingReportComponent } from './reports/training-report/training-report.component';
import { PersonDetailsComponent } from './person/addon/person-details/person-details.component';
import { RemoteService } from './shared/services/remote.service';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './admin/user/user.component';
import { FacilityComponent } from './admin/facility/facility.component';
import { AddUserComponent } from './admin/user/add-user/add-user.component';
import { SettingsGuard } from './shared/guards/settings.guard';

export const AppRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'trainings', component: TrainingComponent, canActivate: [AuthGuard] },
    { path: 'people', component: PersonComponent, canActivate: [AuthGuard] },
    { path: 'timeline', component: TimelineComponent},
    { 
        path: 'certificates', 
        component: CertificateComponent, 
        canActivate: [AuthGuard, CertGuard],
        resolve: {
            cached: TrainingResolver
        }
    },
    { path: 'reports/activity', component: ActivityReportComponent, canActivate: [AuthGuard, CertGuard]},
    { path: 'reports/training', component: TrainingReportComponent, canActivate: [AuthGuard]},
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard, SettingsGuard],
        children: [
            { path: '', redirectTo: 'user', pathMatch: 'full' },
            { path: 'user', component: UserComponent },
            { path: 'facility', component: FacilityComponent },
        ]
    },
    { path: 'denied', component: AccessDeniedComponent},
    /* { 
        path: 'viewperson/:id',
        component: PersonDetailsComponent,
        canActivate: [AuthGuard, CertGuard],
        resolve: {
            person: PersonResolver
        }
    }, */
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
    AddPersonComponent,
    AddPersonGeneralComponent,
    AddPersonContactComponent,
    AddPersonQualificationComponent,
    AddTrainingGeneralComponent,
    AddTrainingParticipantComponent,
    AddTrainingTrainerComponent,
    DashboardComponent,
    CertificateComponent,
    ScoreComponent,
    ShowErrorsComponent,
    CompleteTrainingComponent,
    TimelineComponent,
    CertifyComponent,
    ActivityReportComponent,
    AccessDeniedComponent,    
    TrainingReportComponent,
    PersonDetailsComponent,
    UserComponent,
    AdminComponent,
    FacilityComponent,
    AddUserComponent,
];

export const AppEntryComponents: any = [
    TrainingTitleComponent,
    ConfirmModalComponent,
    AddTrainingComponent,
    AddPersonComponent,
    ScoreComponent,
    CompleteTrainingComponent,
    CertifyComponent,
    AddUserComponent,
];

export const AppServices: any = [
    MasterService,
    TrainingService,
    AlertService,
    LoginService,
    PersonService,
    AuthenticationService,
    UserService,
    SharedService,
    CustomValidators,
    AuthGuard,
    CertGuard,
    SettingsGuard,
    JwtService,
    ReportService,
    ApiService,
    PersonResolver,
    RemoteService,
    TrainingResolver
];

