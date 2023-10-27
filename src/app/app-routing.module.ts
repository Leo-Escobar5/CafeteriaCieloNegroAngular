import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ListadoPedidosComponent } from './listado-pedidos/listado-pedidos.component';
import { CafeOrderComponent } from './cafe-order/cafe-order.component';


const routes: Routes = [
  { path: 'pedidos', component: ListadoPedidosComponent },
  { path: 'orden', component: CafeOrderComponent },
  { path: '', redirectTo: '/orden', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
