import { Component } from '@angular/core';
import { Orden } from '../models/orden.model';
import { CafeService } from '../cafe.service';

@Component({
  selector: 'app-listado-pedidos',
  templateUrl: './listado-pedidos.component.html',
  styleUrls: ['./listado-pedidos.component.css']
})
export class ListadoPedidosComponent {
  pedidos: Orden[] = [];

  constructor(private cafeService: CafeService) { }
  
  ngOnInit(): void {
    this.cafeService.getOrdenes().subscribe(data => {
      this.pedidos = data;
    });
  }
  
}
