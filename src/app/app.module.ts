import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CafeOrderComponent } from './cafe-order/cafe-order.component';
import { HttpClientModule } from '@angular/common/http';
import { ListadoPedidosComponent } from './listado-pedidos/listado-pedidos.component';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    CafeOrderComponent,
    ListadoPedidosComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
