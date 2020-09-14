import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer'
  },
  {
    name: 'Inventario',
    url: '/inventario/compras',
    icon: 'fa fa-list-alt',
    children: [
      {
        name: 'Compras',
        url: '/inventario/compras',
        icon: 'fa fa-opencart'
      },
      {
        name: 'Materiales',
        url: '/inventario/materiales',
        icon: 'fa fa-chain'
      },
      {
        name: 'Productos',
        url: '/inventario/productos',
        icon: 'fa fa-product-hunt'
      },
      {
        name: 'Proveedores',
        url: '/inventario/proveedores',
        icon: 'fa fa-user-circle-o'
      }
    ]
  },
  {
    name: 'Producción',
    url: '/produccion',
    icon: 'fa fa-industry',
    children: [
      {
        name: 'Espumas',
        url: '/produccion/espumas',
        icon: 'fa fa-square'
      },
      {
        name: 'Productos',
        url: '/produccion/productos',
        icon: 'fa fa-product-hunt'
      },
      {
        name: 'Ajustes',
        url: '/produccion/ajustes',
        icon: 'fa fa-cog'
      },
      
    ]
  },

  {
    name: 'Facturación',
    url: '/facturacion',
    icon: 'fa fa-file-text',
    children: [
      {
        name: 'Pedidos',
        url: '/facturacion/pedidos',
        icon: 'fa fa-paste'
      },
      {
        name: 'Facturación',
        url: '/facturacion/facturacion',
        icon: 'fa fa-file-text'
      },
      {
        name: 'Clientes',
        url: '/facturacion/clientes',
        icon: 'fa fa-users'
      },
      
    ]
  },
  {
    name: 'Recursos Humanos',
    url: '/rrhh',
    icon: 'fa fa-user',
    children: [
      {
        name: 'Personal',
        url: '/rrhh/personal',
        icon: 'fa fa-user-o'
      },
      {
        name: 'Formatos',
        url: '/rrhh/formatos',
        icon: 'fa fa-file-text-o'
      },
      {
        name: 'Herramientas',
        url: '/rrhh/herramientas',
        icon: 'fa fa-wrench'
      },
      {
        name: 'Ajustes',
        url: '/rrhh/ajustes',
        icon: 'fa fa-cog'
      }


    ]
  },
  {
    name: 'Contabilidad',
    url: '/contabilidad',
    icon: 'fa fa-credit-card-alt',
    children: [
      {
        name: 'Recibos',
        url: '/contabilidad/recibos',
        icon: 'fa fa-archive'
      },
      {
        name: 'Utilidad',
        url: '/contabilidad/utilidad',
        icon: 'fa fa-money'
      },
      {
        name: 'Ajustes',
        url: '/contabilidad/ajustes',
        icon: 'fa fa-cog'
      },
     

    ]
  },

  {
    name: 'Configuración',
    url: '/configuracion',
    icon: 'fa fa-cogs',
    children: [
      {
        name: 'Usuarios',
        url: '/configuracion/usuarios',
        icon: 'fa fa-user-circle'
      },
      {
        name: 'Ajustes',
        url: '/configuracion/ajustes',
        icon: 'fa fa-cog'
      },
    
  
    ]
  },
  {
    name: 'Cerrar Sesión',
    url: '/users/logout',
    icon: 'fa fa-sign-out'
  },
];
