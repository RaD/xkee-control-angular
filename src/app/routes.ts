import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'confirm/areas/:area_pk/:entity/:entity_pk',
        loadComponent: () => import('../pages/confirmation/component').then(m => m.ConfirmationPage)
    },
    {
        path: 'confirm/areas/:area_pk',
        loadComponent: () => import('../pages/confirmation/component').then(m => m.ConfirmationPage)
    },
    {
        path: 'areas/:area_pk/customer/:customer_pk/payment',
        loadComponent: () => import('../pages/payment/component').then(m => m.PaymentPage)
    },
    {
        path: 'areas/:pk/ble/device/:device_id',
        loadComponent: () => import('../pages/ble_device/component').then(m => m.BleDevicePage)
    },
    {
        path: 'areas/:pk/ble',
        loadComponent: () => import('../pages/ble_list/component').then(m => m.BleListPage)
    },
    {
        path: 'areas/:pk/customer/:customer_pk/linking',
        loadComponent: () => import('../pages/linking/component').then(m => m.LinkingPage)
    },
    {
        path: 'areas/:pk/customer/:customer_pk/:action',
        loadComponent: () => import('../pages/customer/component').then(m => m.CustomerPage)
    },
    {
        path: 'areas/:pk/customers/create',
        loadComponent: () => import('../pages/customer/component').then(m => m.CustomerPage)
    },
    {
        path: 'areas/:pk/customers',
        loadComponent: () => import('../pages/customer_list/component').then(m => m.CustomerListPage)
    },
    {
        path: 'areas/:pk/device/:device_pk/:action',
        loadComponent: () => import('../pages/device/component').then(m => m.DevicePage)
    },
    {
        path: 'areas/:pk/devices/create',
        loadComponent: () => import('../pages/device/component').then(m => m.DevicePage)
    },
    {
        path: 'areas/:pk/devices',
        loadComponent: () => import('../pages/device_list/component').then(m => m.DeviceListPage)
    },
    {
        path: 'areas/:pk/:action',
        loadComponent: () => import('../pages/area/component').then(m => m.AreaPage)
    },
    {
        path: 'areas/create',
        loadComponent: () => import('../pages/area/component').then(m => m.AreaPage)
    },
    {
        path: 'areas/import',
        loadComponent: () => import('../pages/importer/component').then(m => m.ImporterComponent)
    },
    {
        path: 'areas',
        loadComponent: () => import('../pages/area_list/component').then(m => m.AreaListPage)
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/areas'
    },
    {
        path: '**',
        redirectTo: '/areas'
    },
];