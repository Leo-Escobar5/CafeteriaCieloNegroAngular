import { Component, ElementRef, Renderer2 } from '@angular/core';
import { CafeService } from '../cafe.service';

import Swal from 'sweetalert2';
import { Orden } from '../models/orden.model';

interface CoffeeItem {
  count: number;
  price: number;
}

@Component({
  selector: 'app-cafe-order',
  templateUrl: './cafe-order.component.html',
  styleUrls: ['./cafe-order.component.css']
})

export class CafeOrderComponent {


  ticketData: {
    nombre?: string,
    email?: string,
    telefono?: string,
    items: Array<{ tipoDeCafe: string, count: number, precio: number }>,
    galletasExtras: number,
    paquetesGalletas: number,
    precioTotal: number
  } = {
    items: [],
    galletasExtras: 0,
    paquetesGalletas: 0,
    precioTotal: 0
  };
  
  totalGalletas = 0;
  totalPaquetesGalletas = 0;
  totalPrice = 0;
  coffeeCart: { [key: string]: CoffeeItem } = {};

  constructor(private el: ElementRef, private renderer: Renderer2, private cafeService: CafeService) { }

  nextStep(step: number): void {
    switch(step) {
      case 2:
        const nameInput = this.el.nativeElement.querySelector('#name');
        if (!nameInput?.value.trim()) {
          alert('Por favor, ingrese su nombre para continuar.');
          return;
        }
        break;
      case 3:
        if (!Object.keys(this.coffeeCart).length) {
          alert('Por favor, seleccione al menos un café para continuar.');
          return;
        }
        this.generateTicketSummary();
        break;
    }

    const element = this.el.nativeElement;
    const currentStep = element.querySelector('.step:not([style*="display: none"])');
    const next = element.querySelector('#step' + step);

    if (currentStep) {
      this.renderer.setStyle(currentStep, 'display', 'none');
    }
    
    if (next) {
      this.renderer.setStyle(next, 'display', 'block');
    }

    this.updateStepIndicator(step);
  }

  addCoffee(coffeeType: string, price: number): void {
    if (!this.coffeeCart[coffeeType]) {
        this.coffeeCart[coffeeType] = { count: 0, price: price };
    }
    this.coffeeCart[coffeeType].count++;

    switch(coffeeType) {
        case 'Café Mediano':
            this.totalGalletas += 3;
            break;
        case 'Café Grande':
            this.totalGalletas += 6;
            break;
        case 'Café Jumbo':
            this.totalPaquetesGalletas += 1;
            break;
    }
    this.totalPrice += price;

    this.updateCoffeeSummary();
  }

  updateCoffeeSummary(): void {
    const summaryElement = this.el.nativeElement.querySelector('#coffeeSummary');
    summaryElement.innerHTML = '';

    let totalCoffees = 0;

    for (let coffeeType in this.coffeeCart) {
      totalCoffees += this.coffeeCart[coffeeType].count;
      let listItem = this.renderer.createElement('li');
      listItem.innerText = `${coffeeType} - ${this.coffeeCart[coffeeType].count} x $${this.coffeeCart[coffeeType].price}`;
      
      // Crear el botón de eliminar
      let removeButton = this.renderer.createElement('button');
      
      // Añadir el texto "Eliminar" al botón
      let buttonText = this.renderer.createText('Eliminar');
      this.renderer.appendChild(removeButton, buttonText);

      // Agregarle el evento de forma segura al botón
      this.renderer.listen(removeButton, 'click', () => this.removeCoffee(coffeeType));
      this.renderer.appendChild(listItem, removeButton);

      this.renderer.appendChild(summaryElement, listItem);
    }

    if (this.totalGalletas > 0) {
      let galletasItem = this.renderer.createElement('li');
      galletasItem.innerText = `Galletas de regalo: ${this.totalGalletas}`;
      this.renderer.appendChild(summaryElement, galletasItem);
    }

    if (this.totalPaquetesGalletas > 0) {
      let paquetesItem = this.renderer.createElement('li');
      paquetesItem.innerText = `Paquetes de galletas de regalo: ${this.totalPaquetesGalletas}`;
      this.renderer.appendChild(summaryElement, paquetesItem);
    }

    let totalPriceItem = this.renderer.createElement('li');
    totalPriceItem.innerText = `Precio total: $${this.totalPrice}`;
    this.renderer.appendChild(summaryElement, totalPriceItem);
  }

  removeCoffee(coffeeType: string): void {
    if (this.coffeeCart[coffeeType]) {
      this.totalPrice -= this.coffeeCart[coffeeType].price;
  
      switch(coffeeType) {
        case 'Café Mediano':
          this.totalGalletas -= 3;
          break;
        case 'Café Grande':
          this.totalGalletas -= 6;
          break;
        case 'Café Jumbo':
          this.totalPaquetesGalletas -= 1;
          break;
      }
  
      this.coffeeCart[coffeeType].count--;
      
      if (this.coffeeCart[coffeeType].count <= 0) {
        delete this.coffeeCart[coffeeType];
      }
      
      this.updateCoffeeSummary();
    }
  }
  

  jumpToStep(step: number): void {
    // No permitir saltar a un paso si no se cumple la validación
    const element = this.el.nativeElement;
    
    if (step === 2) {
      const nameInput = element.querySelector('#name');
      if (!nameInput?.value.trim()) {
        alert('Por favor, ingrese su nombre para continuar.');
        return;
      }
    }
    
    if (step === 3 && !Object.keys(this.coffeeCart).length) {
      alert('Por favor, seleccione al menos un café para continuar.');
      return;
    }
  
    const currentStep = element.querySelector('.step:not([style*="display: none"])');
    if (currentStep) {
      this.renderer.setStyle(currentStep, 'display', 'none');
    }
  
    const targetStep = element.querySelector('#step' + step);
    if (targetStep) {
      this.renderer.setStyle(targetStep, 'display', 'block');
    }
  
    this.updateStepIndicator(step);
  }
  

  updateStepIndicator(step: number): void {
    const element = this.el.nativeElement;
    const indicators = element.querySelectorAll('.step-indicator');
  
    indicators.forEach((indicator: Element) => {
      this.renderer.removeClass(indicator, 'current');
      if (indicator.getAttribute('data-step') == step.toString()) {
        this.renderer.addClass(indicator, 'current');
      }
    });
  }
  

  async checkStepperAccessibility(): Promise<void> {
    const element = this.el.nativeElement;
    const step2Indicator = element.querySelector('.step-indicator[data-step="2"]');
    const step3Indicator = element.querySelector('.step-indicator[data-step="3"]');

    const nameInput = element.querySelector('#name');
    if (nameInput?.value.trim()) {
      this.renderer.removeClass(step2Indicator, 'disabled');
    } else {
      this.renderer.addClass(step2Indicator, 'disabled');
    }

    if (Object.keys(this.coffeeCart).length) {
      this.renderer.removeClass(step3Indicator, 'disabled');
    } else {
      this.renderer.addClass(step3Indicator, 'disabled');
    }

    await new Promise(resolve => setTimeout(resolve, 100));
    this.checkStepperAccessibility();
  }

  generateTicketSummary(): void {

    

    const element = this.el.nativeElement;
    const ticketElement = element.querySelector('#ticketSummary');

    // Limpiamos el contenido anterior
    ticketElement.innerHTML = ''; 

    // Información del cliente
    const name = element.querySelector('#name').value;
    const email = element.querySelector('#email').value;
    const phone = element.querySelector('#phone').value;


    let clientInfo = `<h3>Información del Cliente</h3>
                      <p>Nombre: ${name}</p>`;
    if (email) clientInfo += `<p>Email: ${email}</p>`;
    if (phone) clientInfo += `<p>Teléfono: ${phone}</p>`;

    ticketElement.innerHTML += clientInfo;


    // Guarda la información del cliente en ticketData
  this.ticketData.nombre = name;
  this.ticketData.email = email;
  this.ticketData.telefono = phone;
  // Llena items con los tipos de café y sus detalles
  this.ticketData.items = [];
  for (let coffeeType in this.coffeeCart) {
    this.ticketData.items.push({
      tipoDeCafe: coffeeType,
      count: this.coffeeCart[coffeeType].count,
      precio: this.coffeeCart[coffeeType].price
    });
  }
  this.ticketData.galletasExtras = this.totalGalletas;
  this.ticketData.paquetesGalletas = this.totalPaquetesGalletas;
  this.ticketData.precioTotal = this.totalPrice;

    // Resumen de pedido
    let orderSummary = '<h3>Detalle del Pedido</h3>';
    for (let coffeeType in this.coffeeCart) {
        orderSummary += `<p>${coffeeType} - ${this.coffeeCart[coffeeType].count} x $${this.coffeeCart[coffeeType].price}</p>`;
    }
    orderSummary += `<p>Galletas de regalo: ${this.totalGalletas}</p>`;
    orderSummary += `<p>Paquetes de galletas de regalo: ${this.totalPaquetesGalletas}</p>`;
    orderSummary += `<p>Precio total: $${this.totalPrice}</p>`;
    
    ticketElement.innerHTML += orderSummary;
  }

  processOrder(): void {
    const datosOrden: Orden = {
      nombre: this.ticketData.nombre,
      email: this.ticketData.email,
      telefono: this.ticketData.telefono,
      tipoDeCafe: this.ticketData.items.map(item => `${item.tipoDeCafe} x ${item.count}`).join(', '),
      precio: this.ticketData.precioTotal,
      galletasExtras: `Galletas de regalo: ${this.ticketData.galletasExtras}, Paquetes de galletas: ${this.ticketData.paquetesGalletas}`,
      fechaOrden: new Date()
    };
    console.log('Datos de la orden:', datosOrden);


    this.cafeService.crearOrden(datosOrden).subscribe(response => {
      Swal.fire({
        title: 'Pedido Realizado',
        text: '¡Gracias por tu compra en Cafetería Cielo Negro!',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.resetOrder();  
        }
      });
    }, error => {
      // Aquí puedes manejar cualquier error que ocurra al intentar insertar la orden
      console.error('Ocurrió un error al crear la orden:', error);
    });
  }

  resetOrder(): void {
    // Acceso y reseteo de los elementos del formulario
    (<HTMLInputElement>document.getElementById('name')).value = '';
    (<HTMLInputElement>document.getElementById('email')).value = '';
    (<HTMLInputElement>document.getElementById('phone')).value = '';
    
    // Resetear las variables (propiedades de clase)
    this.coffeeCart = {};
    this.totalGalletas = 0;
    this.totalPaquetesGalletas = 0;
    this.totalPrice = 0;

    this.updateCoffeeSummary();  
    this.nextStep(1);  
  }

}
