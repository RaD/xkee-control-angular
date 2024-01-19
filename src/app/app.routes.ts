import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmationComponent } from './confirmation/component';
import { AreaComponent } from './area/component';
import { AreaFormComponent } from './area-form/component';
import { DevicesComponent } from './devices/component';
import { DeviceComponent } from './device/component';
import { CustomersComponent } from './customers/component';
import { CustomerComponent } from './customer/component';

export const routes: Routes = [
    {path: 'confirm/areas/:area_pk/:entity/:entity_pk', component: ConfirmationComponent},
    {path: 'confirm/areas/:area_pk', component: ConfirmationComponent},
    {path: 'areas/:pk/customer/:customer_pk/:action', component: CustomerComponent},
    {path: 'areas/:pk/customers/create', component: CustomerComponent},
    {path: 'areas/:pk/customers', component: CustomersComponent},
    {path: 'areas/:pk/device/:device_pk/:action', component: DeviceComponent},
    {path: 'areas/:pk/devices/create', component: DeviceComponent},
    {path: 'areas/:pk/devices', component: DevicesComponent},
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
