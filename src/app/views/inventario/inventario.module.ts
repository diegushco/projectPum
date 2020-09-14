import { SharedModule } from './../../shared.module';
import { ProveedorComponent } from './components/proveedores/proveedor.component';
import { ProductosComponent } from './components/productos/productos.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MaterialesComponent } from './components/materiales/materiales.component';
// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// Components Routing
import { InventarioRoutingModule } from './inventario-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule } from '@angular/forms';
import { NumberDirective } from '../../directives/onlyNumbers.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ComprasComponent } from './components/compras/compras.component';

@NgModule({
  imports: [
    NgxDatatableModule,
    CommonModule,
    FormsModule,
    InventarioRoutingModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    NgSelectModule,
    TooltipModule.forRoot(),
    SharedModule
  ],
  declarations: [
    MaterialesComponent, NumberDirective, ProductosComponent, ProveedorComponent, ComprasComponent
  ]
})
export class InventarioModule { }
