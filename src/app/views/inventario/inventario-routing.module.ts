import { ComprasComponent } from './components/compras/compras.component';
import { ProveedorComponent } from './components/proveedores/proveedor.component';
import { ProductosComponent } from './components/productos/productos.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialesComponent } from './components/materiales/materiales.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Inventario'
    },
    children: [
      {
        path: '',
        redirectTo: 'cards'
      },
      {
        path: 'materiales',
        component: MaterialesComponent,
        data: {
          title: 'Materiales'
        }
      },
      {
        path: 'productos',
        component: ProductosComponent,
        data: {
          title: 'Productos'
        }
      }
      ,
      {
        path: 'proveedores',
        component: ProveedorComponent,
        data: {
          title: 'Proveedores'
        }
      },
      {
        path: 'compras',
        component: ComprasComponent,
        data: {
          title: 'Compras'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventarioRoutingModule {}
