import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmationPage } from '../pages/confirmation/component';
import { AreaListPage } from '../pages/area_list/component';
import { AreaPage } from '../pages/area/component';
import { DeviceListPage } from '../pages/device_list/component';
import { DevicePage } from '../pages/device/component';
import { CustomerListPage } from '../pages/customer_list/component';
import { CustomerPage } from '../pages/customer/component';
import { ImporterComponent } from '../pages/importer/component';
import { LinkingPage } from '../pages/linking/component';

export const routes: Routes = [
    {path: 'confirm/areas/:area_pk/:entity/:entity_pk', component: ConfirmationPage},
    {path: 'confirm/areas/:area_pk', component: ConfirmationPage},
    {path: 'areas/:pk/customer/:customer_pk/linking', component: LinkingPage},
    {path: 'areas/:pk/customer/:customer_pk/:action', component: CustomerPage},
    {path: 'areas/:pk/customers/create', component: CustomerPage},
    {path: 'areas/:pk/customers', component: CustomerListPage},
    {path: 'areas/:pk/device/:device_pk/:action', component: DevicePage},
    {path: 'areas/:pk/devices/create', component: DevicePage},
    {path: 'areas/:pk/devices', component: DeviceListPage},
    {path: 'areas/:pk/:action', component: AreaPage},
    {path: 'areas/create', component: AreaPage},
    {path: 'areas/import', component: ImporterComponent},
    {path: 'areas', component: AreaListPage},
    {path: '', pathMatch: 'full', redirectTo: '/areas'},
    {path: '**', redirectTo: '/areas'},
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {enableTracing: true})],
    exports: [RouterModule],
})
export class AppRoutingModule {}
