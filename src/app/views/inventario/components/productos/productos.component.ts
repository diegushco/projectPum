import { DensityService } from './../../../../services/density.service';
import { TaxesService } from './../../../../services/taxes.service';
import { TypeProductService } from './../../../../services/typeProducts.service';
import { ProductsService } from "./../../../../services/products.service";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Observable, fromEvent } from "rxjs";
import { tap, filter, debounceTime, map, distinctUntilChanged } from "rxjs/operators";
import { ModalDirective } from "ngx-bootstrap/modal";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ProviderService } from '../../../../services/provider.service';
import { IProduct, IOptionalProduct } from '../../../../interfaces/products.interface';

@Component({
  selector: "app-productos",
  templateUrl: "productos.component.html",
  styleUrls: ["productos.component.css"]
})
export class ProductosComponent implements OnInit {
  @ViewChild("modalProduct") public modalProduct: ModalDirective;
  @ViewChild('search', { static: false }) search: any;
  @ViewChild("modalAlert") public modalAlert: ModalDirective;
  @ViewChild('newname', { static: false }) newname: ElementRef;

  rows: any = [];
  rowsCopy: any = [];
  columns: any = [
    'product_code',
    'name',
    'quantity',
    'production_cost',
    'sell_price',
    'origin',
    'usage',
  ];

  columnsText:any = [
    "Cod", "Nombre", "Cant.", "Costo", "Precio de Venta", "Origen", "Destino"
  ];
  currentRowId: number;

  requestProduct: IProduct;

  currentProduct: IProduct;

  listProducts$: Observable<any>;

  formType:string;

  forRemoved:any;

  form = new FormGroup({
    product_code: new FormControl(null, Validators.required),
    typeproductId: new FormControl(null, [Validators.required]),
    name: new FormControl(null, Validators.required),
    newname: new FormControl(null),
    quantity: new FormControl(null, Validators.required),
    width: new FormControl(null,),
    long: new FormControl(null, ),
    height: new FormControl(null, ),
    densityId: new FormControl(null, ),
    production_cost: new FormControl(null, Validators.required),
    sell_price: new FormControl(null, Validators.required),
    origin: new FormControl(null, Validators.required),
    usage: new FormControl(null, Validators.required),
    status: new FormControl(null),
    taxesId: new FormControl(null, Validators.required),
    price: new FormControl(null),
    date_in: new FormControl(),
    profit_margin: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^(0(\.\d+)?|1(\.0+)?)$/)
    ]),
  });

  mode = "Agregar";

  providers$: any;

  loadingIndicatorTable = false;
  loadingIndicatorButton = false;
  productTypes$:any;
  taxes$:Observable<any>;
  destines:any = [
    {
      description:'Produccion'
    },
    {
      description:'Venta'
    }
  ];

  productsName:any;

  densities$:Observable<any>;

  fieldsOptional:IOptionalProduct = {
    width: null,
    height: null,
    long: null,
    densityId: null
  };
  currentQty:number = null;

  constructor(
    private _productsService: ProductsService,
    private _providerService: ProviderService,
    private toastr: ToastrService,
    private _typeProductService:TypeProductService,
    private _taxesService:TaxesService,
    private _densityService: DensityService
  ) {}

  ngOnInit() {
    this.loadItems();
    this.form.get('origin').setValue('Apertura');
    
    this.taxes$ = this._taxesService.getAllTaxes();
    this.densities$ = this._densityService.getAllDensity();
    this.providers$ = this._providerService.getAllProvider();
    this._typeProductService.getAllTypeProducts().subscribe((data)=>{
      this.productTypes$ = data;
    });

    this.form.get('typeproductId').valueChanges.subscribe((tipo)=>{
      if(tipo !== null){
        this.form.get('name').setValue(null, {emitEvent: false, onlySelf: true});
        this.form.get('production_cost').setValue(null);
        this.form.get('sell_price').setValue(null);
        this._typeProductService.getProductsNameByType(tipo).subscribe((data)=>{
          
          this.productsName = data;
          this.productsName.unshift({name:"Crear nuevo producto", value:"new-product"});
        });
      }
    });

    this.form.get('name').valueChanges.subscribe((name)=>{
      if(name !== null && this.productsName !== null && this.productsName !== undefined){
        const product = this.productsName.filter((tr)=> tr.name === name)[0]; 
        if(product.value && product.value === 'new-product'){
          this.formType = "POST";

          this.form.controls["newname"].setValidators([Validators.required]);
          this.form.controls["newname"].updateValueAndValidity();
          this.form.controls["newname"].reset();
          this.form.get('product_code').setValidators([]);
          this.form.controls["product_code"].reset();
          setTimeout(() => {
            this.newname.nativeElement.focus();
          }, 10);
         
        }else{
          this.form.controls["product_code"].setValidators([Validators.required]);
          this.form.controls["product_code"].updateValueAndValidity();
          
          this.currentRowId = product.id;
          this.fieldsOptional = {
            width: product.width,
            height: product.height,
            long: product.long,
            densityId: product.densityId
          };
          this.currentQty = product.quantity;
          this.formType = "PUT";
          this.form.get('production_cost').setValue(product.production_cost);
          this.form.get('sell_price').setValue(product.sell_price);
          this.form.get('product_code').setValue(product.product_code);
          this.form.get('price').setValue(product.price);
          this.form.get('date_in').setValue(product.date_in);
          this.form.get('newname').setValidators([]);
          this.form.get('newname').reset();
        }

        
      }
      
    });
   
    this.form.get('profit_margin').valueChanges.subscribe(()=>{
      this.calcSellPrice();
    });
    this.form.get('production_cost').valueChanges.subscribe(()=>{
      this.calcSellPrice();
    });

  }

  loadItems() {
    this.loadingIndicatorTable = true;
    this.listProducts$ = this._productsService.getAllProducts().pipe(
      tap(data => {
        this.rowsCopy = data;
        this.rows = [...this.rowsCopy];
        
        this.loadingIndicatorTable = false;
      })
    );
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

  removed(row){
    this.loadingIndicatorButton = true;
    this._productsService.deleteProductById(row.id).subscribe(xc => {
      this.rows = this.rows.filter(jk => row.id !== jk.id);
      this.loadingIndicatorButton = false;
      this.modalAlert.hide();
    });
  }

  remove(row) {
    this.forRemoved = row;
    this.modalAlert.show();
  }

  manageTypes() {
    // const dateObj = new Date();
    // const dateNew = dateObj.getFullYear() + '-' + (dateObj.getMonth()+1) + '-' + dateObj.getDate();

    const qty = (this.currentQty !== null)?(parseFloat(this.form.get('quantity').value) + this.currentQty): parseFloat(this.form.get('quantity').value);
 
    this.requestProduct = {
      typeproductId: parseInt(this.form.get('typeproductId').value),
      name: (this.form.get('name').value === 'Crear nuevo producto')?this.form.get('newname').value:this.form.get('name').value,
      quantity: qty,
      production_cost: parseFloat(this.form.get('production_cost').value),
      sell_price: parseFloat(this.form.get('sell_price').value),
      origin: this.form.get('origin').value,
      usage: this.form.get('usage').value,
      status: 'Activo',
      //date_in: (this.form.get('date_in').value !== null)?this.form.get('date_in').value: dateNew,
      price: (this.form.get('price').value !== null )?this.form.get('price').value:0,
      taxesId: this.form.get('taxesId').value,
      profit_margin: parseFloat(this.form.get('profit_margin').value)
    };

    if(this.form.get('width').value !== null){
      this.requestProduct = {
         ...this.requestProduct,
        width: parseInt(this.form.get('width').value)
      };
    }else{
      this.requestProduct = {
        ...this.requestProduct,
       width: this.fieldsOptional.width
     };
    }

    if(this.form.get('height').value !== null){
      this.requestProduct = {
         ...this.requestProduct,
         height: parseInt(this.form.get('height').value)
      };
    }else{
      this.requestProduct = {
        ...this.requestProduct,
        height: this.fieldsOptional.height
     };
    }

    if(this.form.get('long').value !== null){
      this.requestProduct = {
         ...this.requestProduct,
        long: parseInt(this.form.get('long').value)
      };
    }else{
      this.requestProduct = {
        ...this.requestProduct,
       long: this.fieldsOptional.long
      };
    }

    if(this.form.get('densityId').value !== null){
      this.requestProduct = {
         ...this.requestProduct,
        densityId: parseInt(this.form.get('densityId').value)
      };
    }else{
      this.requestProduct = {
        ...this.requestProduct,
       densityId: this.fieldsOptional.densityId
     };
    }

    if(this.formType === 'PUT'){
      this.requestProduct = {
        ...this.requestProduct,
       product_code: this.form.get('product_code').value
     };
    }

    //this.requestProduct.date_in = new Date(this.requestProduct.date_in);
  }

  saveProduct() {
    this.loadingIndicatorButton = true;
    this.manageTypes();

    if(this.formType === "POST"){
      this._productsService.saveProduct(this.requestProduct)
      .pipe(distinctUntilChanged())
      .subscribe(gh => {
        this.toastr.success("Guardar", "El producto se ha guardado");
        this.modalProduct.hide();
        this.loadItems();
        this.loadingIndicatorButton = false;
      });
    }else if(this.formType === "PUT"){
      this.requestProduct.id = this.currentRowId;
      this._productsService.updateProduct(this.requestProduct)
        .pipe(distinctUntilChanged()).
      subscribe(qw => {
        this.toastr.success("Actualizar", "El producto se ha actualizado");
        this.modalProduct.hide();
        this.loadItems();
        this.loadingIndicatorButton = false;
      });
    }

    
  }

  edit(row) {
    this.cleanForm();
    this.form.controls["typeproductId"].disable();
    this.form.controls["name"].disable();
    this.formType = "PUT";

    this.mode = "Editar";

    this.modalProduct.show();
    this.form.get("product_code").setValue(row.product_code);
    this.form.get("typeproductId").setValue(row.typeproductId);
    this.form.get("name").setValue(row.name, {emitEvent: false, onlySelf: true});
    this.form.get("quantity").setValue(row.quantity);
    this.form.get("price").setValue(row.price);
    this.form.get("width").setValue(row.width);
    this.form.get("long").setValue(row.long);
    this.form.get("height").setValue(row.height);
    this.form.get("production_cost").setValue(row.production_cost);
    this.form.get("sell_price").setValue(row.sell_price);
    this.form.get("origin").setValue(row.origin);
    this.form.get("usage").setValue(row.usage);
    this.form.get("status").setValue(row.status);
    this.form.get("densityId").setValue(row.densityId);
    this.form.get("taxesId").setValue(row.taxesId);
    this.form.get('profit_margin').setValue(row.profit_margin);
    this.currentRowId = row.id;
  }

  detail(row) {
    this.cleanForm();
    this.mode = "Detalle";
    this.modalProduct.show();
    this.currentProduct = row;
  }

  addProduct() {
    this.cleanForm();
    this.mode = "Agregar";
    this.modalProduct.show();
  }

  cleanForm(){
    this.form.controls["typeproductId"].enable();
    this.form.controls["name"].enable();
    this.form.reset();
    this.form.get('origin').setValue('Apertura');
  }

  updateProduct() {
    this.loadingIndicatorButton = true;
    this.manageTypes();
    this.requestProduct.id = this.currentRowId;
    this._productsService.updateProduct(this.requestProduct).subscribe(qw => {
      this.toastr.success("Actualizar", "El producto se ha actualizado");
      this.modalProduct.hide();
      this.loadItems();
      this.loadingIndicatorButton = false;
    });
  }

  calcSellPrice(){
    this.form.get('sell_price').reset();
    const profitMargin:number = this.form.get('profit_margin').value;
    const costProduction: number = this.form.get('production_cost').value;
   
    if(profitMargin !== null 
      && costProduction !== null
      && this.form.get('profit_margin').valid ){
      const sellPrice = (costProduction/(1-profitMargin));
      
      this.form.get('sell_price').setValue(sellPrice);
    }
    
  }
}
