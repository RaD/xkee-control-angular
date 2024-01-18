import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaComponent } from './area/component';
import { AreaFormComponent } from './area-form/component';
import { ConfirmationComponent } from './confirmation/component';

export const routes: Routes = [
    {path: 'confirm/:entity/:pk', component: ConfirmationComponent},
    {path: 'areas/:pk/:action', component: AreaFormComponent},
    {path: 'areas/create', component: AreaFormComponent},
    {path: 'areas', component: AreaComponent},
    {path: '', pathMatch: 'full', redirectTo: '/areas'},
    {path: '**', redirectTo: '/areas'},
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {enableTracing: true})],
    exports: [RouterModule],
})
export class AppRoutingModule {}
