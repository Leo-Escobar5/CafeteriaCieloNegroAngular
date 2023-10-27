import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Orden } from './models/orden.model';

@Injectable({
  providedIn: 'root'
})
export class CafeService {

  private baseUrl = 'https://localhost:7177/api/Cafe';

  constructor(private http: HttpClient) { }

  getOrdenes(): Observable<Orden[]> {
    return this.http.get<Orden[]>(this.baseUrl);
  }

  

  crearOrden(datos:Orden){
    return this.http.post(this.baseUrl,datos)
  }
}
