import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmationComponent } from './confirmation/component';
import { AreasComponent } from './areas/component';
import { AreaComponent } from './area/component';
import { DevicesComponent } from './devices/component';
import { DeviceComponent } from './device/component';
import { CustomersComponent } from './customers/component';
import { CustomerComponent } from './customer/component';
import { ImporterComponent } from './importer/component';

export const routes: Routes = [
    {path: 'confirm/areas/:area_pk/:entity/:entity_pk', component: ConfirmationComponent},
    {path: 'confirm/areas/:area_pk', component: ConfirmationComponent},
    {path: 'areas/:pk/customer/:customer_pk/:action', component: CustomerComponent},
    {path: 'areas/:pk/customers/create', component: CustomerComponent},
    {path: 'areas/:pk/customers', component: CustomersComponent},
    {path: 'areas/:pk/device/:device_pk/:action', component: DeviceComponent},
    {path: 'areas/:pk/devices/create', component: DeviceComponent},
    {path: 'areas/:pk/devices', component: DevicesComponent},
    {path: 'areas/:pk/:action', component: AreaComponent},
    {path: 'areas/create', component: AreaComponent},
    {path: 'areas/import', component: ImporterComponent},
    {path: 'areas', component: AreasComponent},
    {path: '', pathMatch: 'full', redirectTo: '/areas'},
    {path: '**', redirectTo: '/areas'},
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {enableTracing: true})],
    exports: [RouterModule],
})
export class AppRoutingModule {}
