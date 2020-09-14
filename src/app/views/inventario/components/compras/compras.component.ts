import { IProvider } from './../../../../interfaces/provider.interface';
import { IProduct } from './../../../../interfaces/products.interface';
import { ProductsService } from './../../../../services/products.service';
import { IPurchase } from './../../../../interfaces/purchase.interface';
import { combineLatest } from 'rxjs';
import { PurchaseService } from './../../../../services/purchase.service';
import { TaxesService } from './../../../../services/taxes.service';
import { SuppliesServices } from './../../../../services/supplies.services';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { tap, filter, debounceTime, map } from 'rxjs/operators';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProviderService } from '../../../../services/provider.service';
import { TypeProductService } from '../../../../services/typeProducts.service';
import { DensityService } from '../../../../services/density.service';

@Component({
  selector: 'app-compras',
  templateUrl: 'compras.component.html',
  styleUrls: ['compras.component.css']
})
export class ComprasComponent implements OnInit, AfterViewInit {

  @ViewChild('modalCreatePurchase') public modalCreatePurchase: ModalDirective;
  @ViewChild('modalDetailPurchase') public modalDetailPurchase: ModalDirective;
  @ViewChild('nameProduct', {static: false}) nameProduct: ElementRef;
  
  @ViewChild('search', { static: false }) search: any;

  rows: any = [];
  rowsCopy:any = [];
  columns:any = [
    'purchase_code',
    'date',
    'providerName',
    'items_quantity',
    'total_cost',
    'purchase_taxes',
    'purchase_cost'
  ];

  columnsText:any = [
    'Cód.',
    'Fecha',
    'Proveedor',
    'Cantidad',
    'Total sin IVA',
    'IVA',
    'Total con IVA'
  ];
  currentRowId:number;

  requestPurchase:IPurchase;

  currentPurchase:IPurchase = null;

  listPurchase$: Observable<any>;

  
  mode = "Agregar";

  taxes$:Observable<any>;

  form: FormGroup;

  formArray: FormArray;

  productTypes$:any;

  productsName:any[] = [];

  productsDensity$:any;

  destines:any = [
    {
      description:'Produccion'
    },
    {
      description:'Venta'
    }
  ];

  listTaxes = [];

  totalIVA = 0;

  providers: IProvider[] = [];
  arrayValid = false;
  isNew: boolean[] = [];

  constructor(private _purchaseService:PurchaseService,
     private toastr: ToastrService,
     private _providerService:ProviderService,
     private _taxesService:TaxesService,
     private fb: FormBuilder,
     private _typeProductService:TypeProductService,
     private _densityService: DensityService
     ){}

  ngOnInit(){
    this.formArray = this.fb.array([], [Validators.required]);

    this.loadItems();
    this.form = this.fb.group({
      purchase_code: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      provider_id: new FormControl(null, Validators.required),
      taxes_id: new FormControl(null, Validators.required),
      items_quantity: new FormControl(0, Validators.required),
      purchase_cost: new FormControl(null, Validators.required),
      purchase_taxes: new FormControl(null, Validators.required),
      total_cost: new FormControl(null, Validators.required),
      profit_margin: new FormControl(null, [Validators.required, Validators.pattern(/^(0(\.\d+)?|1(\.0+)?)$/)]),
      products: this.formArray,
    });

    this.productTypes$ = this._typeProductService.getAllTypeProducts();
    this.productTypes$ = this._typeProductService.getAllTypeProducts();
    this.productsDensity$ = this._densityService.getAllDensity();
    this.taxes$ = this._taxesService.getAllTaxes().pipe(tap((iva)=>{
      this.form.get('taxes_id').setValue(iva[0].id);
      this.listTaxes = iva;
    }));
    this.listenerArray();

    
  }

  changeIVA(){
    
    this.calcPrice(this.form.get('products').value);
  }

  get products(): FormArray {
    return this.form.get('products') as FormArray;
  }

  createForms(): FormGroup {
    const formGroup: FormGroup = new FormGroup({
      id: new FormControl(null),
      product_code: new FormControl(null),
      name: new FormControl(null, Validators.required),
      quantity: new FormControl(null, Validators.required),
      quantityTotal: new FormControl(null),
      width: new FormControl(null, ),
      long: new FormControl(null, ),
      height: new FormControl(null, ),
      production_cost: new FormControl(null, Validators.required),
      price: new FormControl(null,),
      sell_price: new FormControl(null),
      origin: new FormControl(null),
      usage: new FormControl(null, Validators.required),
      status: new FormControl(null),
      typeproductId: new FormControl(null, Validators.required),
      taxesId: new FormControl(null),
      densityId: new FormControl(null,),
      isNew: new FormControl(false, Validators.required),
      total: new FormControl(0, Validators.required),
      profit_margin: new FormControl(0),
    });
    return formGroup;
  }

  addProduct() {

    const dataFormArray = this.form.get('products').value;
    const lastForm = (this.form.get('products') as FormArray).valid;
    if(dataFormArray.length === 0 || lastForm){
      this.formArray.push(this.createForms());
      this.productsName.push(null);
      this.isNew.push(false);
      const qtyItems = parseInt(this.form.get('items_quantity').value);
      this.form.get('items_quantity').setValue((qtyItems + 1));
    }else{
      this.arrayValid = true;
    }
  }

  cleanFormArray(){
    (<FormArray>this.form.controls['products']).clear();
    this.productsName = [];
    this.isNew = [];
    this.productsName.push(null);
    this.isNew.push(false);
    
    this.form.get('purchase_code').setValue(null);
    this.form.get('date').setValue(null);
    this.form.get('provider_id').setValue(null);
    this.form.get('items_quantity').setValue(0);
    this.form.get('purchase_cost').setValue(null);
    this.form.get('purchase_taxes').setValue(null);
    this.form.get('total_cost').setValue(null);
    this.form.get('profit_margin').setValue(null);
  }
  
  listenerArray(){
    (this.form.get(
      'products'
    ) as FormArray).valueChanges.subscribe((data) => {
      this.arrayValid = false;
      this.calcPrice(data);
    });
  }

  calcPrice(data){
    const iva = this.listTaxes.find((t)=> t.id === this.form.get('taxes_id').value).value;
      let subtotal = 0;
      data.forEach((f)=>{
        subtotal += parseFloat(f.total);
      });
      this.form.get('total_cost').setValue(subtotal);
      
      
      this.totalIVA = (iva>0)?iva*subtotal:0;
      const totalPurchase = subtotal  + this.totalIVA;
      this.form.get('purchase_taxes').setValue(this.totalIVA);
      this.form.get('purchase_cost').setValue(totalPurchase);
  }

  ngAfterViewInit(): void {
    fromEvent(this.search.nativeElement, 'keydown')
      .pipe(
        debounceTime(500),
        map(x => x['target']['value'])
      )
      .subscribe(value => {
        this.updateFilter(value);
      });
  }

  changeTypeProduct(event, index){
    const control = (<FormArray>this.form.controls['products']).at(index)['controls'];
    control.name.setValue(null);
    
    
    if(event){
      this._typeProductService.getProductsNameByType(event.id).subscribe((data)=>{
        
        this.productsName[index] = data;
        this.productsName[index].unshift({name:"Crear nuevo producto", value:"new-product"});
      });
    }else{
      this.productsName[index] = null;
      this.isNew[index] = false;
      this.cleanInputs(control);
    }
  }

  editTotal(index){
    const control = (<FormArray>this.form.controls['products']).at(index)['controls'];
    const total = (control.production_cost.value * control.quantity.value).toFixed(2);
    control.total.setValue(total);
  }

  cleanInputs(control){
    control.width.setValue(null);
    control.height.setValue(null);
    control.long.setValue(null);
    control.densityId.setValue(null);
    control.usage.setValue(null);
    control.price.setValue(null);
    control.total.setValue(0);
    control.id.setValue(null);;
    control.origin.setValue(null);
    control.product_code.setValue(null);
    control.production_cost.setValue(null);
    control.sell_price.setValue(null);
    control.status.setValue(null);
    control.taxesId.setValue(null);
    control.long.enable();
    control.width.enable();
    control.height.enable();
    control.production_cost.enable();
  }

  cancelNewProduct(index){
    this.isNew[index] = false;
    (<FormArray>this.form.controls['products']).at(index)['controls'].name.setValue(null);

    const control = (<FormArray>this.form.controls['products']).at(index)['controls'];
    this.cleanInputs(control);
  }

  changeProductName(event: IProduct, index){
    
    const evento:any = event;
    const control = (<FormArray>this.form.controls['products']).at(index)['controls'];
    //control.total.disable();

    if(evento && evento.value && evento.value === 'new-product'){
      
      this.cleanInputs(control);
      this.isNew[index] = true;
      control.isNew.setValue(this.isNew[index]);
      control.name.setValue(null);
      setTimeout(()=>{ 
        this.nameProduct.nativeElement.focus();
      },5);

      control.long.enable();
      control.width.enable();
      control.height.enable();
      control.production_cost.enable();
    }else if(event){
      this.isNew[index] = false;
      control.isNew.setValue(this.isNew[index]);
      
      control.long.disable();
      control.width.disable();
      control.height.disable();
      //control.production_cost.disable();
      control.quantityTotal.setValue(event.quantity);
      control.long.setValue(event.long);
      control.width.setValue(event.width);
      control.height.setValue(event.height);
      control.densityId.setValue(event.densityId);
      control.usage.setValue(event.usage);
      control.production_cost.setValue(event.production_cost);
      const total = (event.production_cost * control.quantity.value).toFixed(2);
      control.total.setValue(total);
      
      control.id.setValue(event.id);
      control.isNew.setValue(false);
      control.origin.setValue(event.origin);
      control.product_code.setValue(event.product_code);
      control.production_cost.setValue(event.production_cost);
      control.sell_price.setValue(event.sell_price);
      control.status.setValue(event.status);
      control.taxesId.setValue(event.taxesId);
       
      
    }else{
      this.cleanInputs(control);
    }

  }

  delete(index) {
    (this.form.get('products') as FormArray).removeAt(index);
    delete this.productsName[index];
    this.isNew.splice(index, 1);
    const qtyItems = parseInt(this.form.get('items_quantity').value);
    this.form.get('items_quantity').setValue((qtyItems - 1));
  }

  updateFilter(val :string){
    const value = val.toString().toLowerCase().trim();
    const count = this.columns.length;
    const keys = this.columns;
    this.rows = this.rowsCopy.filter(item => {
      for (let i = 0; i < count; i++) {
        if (
          (item[keys[i]] &&
            item[keys[i]]
              .toString()
              .toLowerCase()
              .indexOf(value) !== -1) ||
          !value
        ) {
          return true;
        }
      }
    });
  }

  loadItems(){
    this.listPurchase$ = combineLatest(
      this._purchaseService.getAllPurchases(),
      this._providerService.getAllProvider(),
      this._taxesService.getAllTaxes()
    )
     .pipe(tap((data)=>{
      
       data[0].forEach((val)=>{
         const dateInvoice = new Date(val.date);
         const dateTimeFormat = new Intl.DateTimeFormat('es', { year: 'numeric', month: 'long', day: '2-digit' });
         const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat .formatToParts(dateInvoice); 
        
         val.date = month + ' ' + day + ', ' + year;
       });
       const purchases = data[0];
       this.providers = data[1];
       const taxes = data[2];
       purchases.forEach((p)=>{
         p.providerName = this.providers.filter((pro)=> pro.id === p.provider_id )[0].name;
         p.taxeName = taxes.filter((t)=> t.id === p.taxes_id )[0].description;
       });

     
      this.rowsCopy = purchases;
      this.rows = [...this.rowsCopy];
    }));
  }


 
  savePurchase(){

    this.requestPurchase = {
      purchase: {
        profit_margin: this.form.value.profit_margin,
        date: this.form.value.date,
        items_quantity: this.form.value.items_quantity,
        provider_id: this.form.value.provider_id,
        purchase_code: this.form.value.purchase_code,
        purchase_cost: this.form.value.purchase_cost,
        purchase_taxes: this.form.value.purchase_taxes,
        taxes_id: this.form.value.taxes_id,
        total_cost: this.form.value.total_cost
      },
      products: this.form.value.products
    };
  
    this.requestPurchase.products.map((producto)=>{
      
      if(producto.isNew){
        if(producto.width === null){
          producto.width = 0;
        }
        if(producto.long === null){
          producto.long = 0;
        }
        if(producto.height === null){
          producto.height = 0;
        }
        if(producto.densityId === null){
          producto.densityId = 0;
        }
        producto.origin = 'Compras';
        producto.status = "Activo";
        producto.sell_price = 0;
        producto.price = 0;
        producto.profit_margin = 0;
        
       
        delete producto.total;
       

        if(producto.taxesId === null){
          producto.taxesId = this.form.value.taxes_id
        }
        
      }

      if(producto.quantityTotal !== null){
        producto.quantity = producto.quantity + producto.quantityTotal;
      }
      delete producto.quantityTotal;
    });
  
    
    this._purchaseService.savePurchase(this.requestPurchase).subscribe((gh)=>{
      
      this.toastr.success('Guardar', 'La compra se ha guardado');
      this.modalCreatePurchase.hide();
      this.loadItems();
    });
  }


  detail(row){
    this.mode = "Detalle"
    this.modalDetailPurchase.show();
    this.currentPurchase = row;
  }

  addPurchase(){
    //this.form.reset();
    this.mode = "Agregar";
    this.cleanFormArray();
    this.modalCreatePurchase.show();
    this.addProduct();
  }

}
