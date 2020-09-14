import { TaxesService } from './../../../../services/taxes.service';
import { SuppliesServices } from './../../../../services/supplies.services';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable, fromEvent, of } from 'rxjs';
import { tap, filter, debounceTime, map, distinctUntilChanged } from 'rxjs/operators';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProviderService } from '../../../../services/provider.service';
import { ISupplie } from '../../../../interfaces/materials.interface';
import { IMeasure } from '../../../../interfaces/measure.interface';

@Component({
  selector: 'app-materiales',
  templateUrl: 'materiales.component.html',
  styleUrls: ['materiales.component.css']
})
export class MaterialesComponent implements OnInit, AfterViewInit {

  @ViewChild('modalSupplies') public modalSupplies: ModalDirective;
  @ViewChild('search', { static: false }) search: any;
  @ViewChild("modalAlert") public modalAlert: ModalDirective;

  rows: any = [];
  rowsCopy:any = [];
  columns:any = [
    'supplies_code',
    'name',
    'quantity',
    'min_quantity',
    'total_cost',
    'measure',
    'type',
  ];
  columnsText:any = [
    "Cod", "Nombre", "Cant.", "Cant. Minima", "Costo con IVA", "Unidad de medida", "Tipo"
  ];
  currentRowId:number;

  requestSupplie:ISupplie;

  currentSupplie:ISupplie;

  listSupplies$: Observable<any>;

  forRemoved:any;

  form = new FormGroup({
    supplies_code: new FormControl(null),
    name: new FormControl(null, Validators.required),
    quantity: new FormControl(null, [Validators.required, Validators.pattern(/^[.\d]+$/)]),
    measure: new FormControl(null, Validators.required),
    cost: new FormControl(null, Validators.required),
    taxes: new FormControl(null, Validators.required),
    total_cost: new FormControl(null, Validators.required),
    type: new FormControl(null, Validators.required),
    desc: new FormControl(null, Validators.required),
    image: new FormControl(null),
    status: new FormControl(null),
    min_quantity: new FormControl(null, [Validators.required, Validators.pattern(/^[.\d]+$/)]),
    taxes_id: new FormControl(null, Validators.required),
    provider_id: new FormControl(null),
  });

  mode = "Agregar";

  providers$:Observable<any>;

  taxes$:Observable<any>;
  taxes;

  loadingIndicatorTable = false;
  loadingIndicatorButton = false;

  measures: IMeasure[] = [
    {code: 'Kg', value: 'Kilogramos'},
    {code: 'Mt', value: 'Metros'},
    {code: 'Gr', value: 'Gramos'},
    {code: 'Lb', value: 'Libras'},
    {code: 'Cm', value: 'Centimetros'},
    {code: 'Lt', value: 'Litros'},
    {code: 'Ml', value: 'Mililitros'},
    {code: 'Und', value: 'Unidades'},
    {code: 'Doc', value: 'Docenas'},
  ];

  measures$: Observable<IMeasure[]>;

  constructor(private _supplieService:SuppliesServices,
     private toastr: ToastrService,
     private _providerService:ProviderService,
     private _taxesService:TaxesService
     ){}

  ngOnInit(){
    this.loadItems();
    this.providers$ = this._providerService.getAllProvider();
    this.taxes$ = this._taxesService.getAllTaxes().pipe(
      tap(
        (taxes)=>{
          this.taxes = taxes;
        }
       )
    );

    this.measures$ = of(this.measures);

    this.form.get('cost').valueChanges.subscribe((cost)=>{
      
      if(cost !== null && this.taxes && this.form.get('taxes_id').value !== null){
        this.calculateCostIVA(this.form.get('taxes_id').value);
      }
    });

    this.form.get('taxes_id').valueChanges.subscribe((taxe)=>{
      if(taxe !== null && this.taxes){
        this.calculateCostIVA(taxe);
      }
      
    });
  }

  calculateCostIVA(taxe){
    if(this.taxes && this.taxes.length > 0){
      const valueTaxe:number = this.taxes.find((ta)=> ta.id === taxe ).value;
     
      const costo:number =  this.form.get('cost').value;
      
      const impuesto:number = costo * valueTaxe;
      this.form.get('taxes').setValue(impuesto);
     
      const summa:number = parseFloat(costo.toString()) + parseFloat(impuesto.toString());
     
      this.form.get('total_cost').setValue(summa);
    }
    
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

  loadItems(){
    this.loadingIndicatorTable = true;
    this.listSupplies$ = this._supplieService.getAllSupplies().pipe(tap((data)=>{
      this.rowsCopy = data;
      this.rows = [...this.rowsCopy];
      setTimeout(() => {
        this.loadingIndicatorTable = false;
      }, 500);
    }));
  }

 

  removed(row){
    this.loadingIndicatorButton = true;
    this._supplieService.deleteSupplieById(row.id).subscribe((xc) => {
      this.rows = this.rows.filter((jk)=> row.id !== jk.id);
      this.loadingIndicatorButton = false;
      this.modalAlert.hide();
    });
  }

  remove(row) {
    this.forRemoved = row;
    this.modalAlert.show();
  }

  manageTypes(){
    this.requestSupplie = this.form.getRawValue();
    //this.requestSupplie.name = parseInt(this.requestSupplie.name.toString());
    this.requestSupplie.quantity = parseFloat(this.requestSupplie.quantity.toString());
    this.requestSupplie.cost = parseFloat(this.requestSupplie.cost.toString());
    this.requestSupplie.taxes = parseFloat(this.requestSupplie.taxes.toString());
    this.requestSupplie.total_cost = parseFloat(this.requestSupplie.total_cost.toString());
    this.requestSupplie.min_quantity = parseFloat(this.requestSupplie.min_quantity.toString());
    this.requestSupplie.taxes_id = parseInt(this.requestSupplie.taxes_id.toString());
    this.requestSupplie.provider_id = 0;
  }

 
  saveSupplie(){
    this.loadingIndicatorButton = true;
    this.manageTypes();
    delete this.requestSupplie.supplies_code;
    this._supplieService.saveSupplie(this.requestSupplie)
    .pipe(distinctUntilChanged())
    .subscribe((gh)=>{
      
      this.toastr.success('Guardar', 'El material se ha guardado');
      this.modalSupplies.hide();
      this.loadItems();
      this.loadingIndicatorButton = false;
    });
  }

  edit(row){
    this.cleanForm();
    this.mode = "Editar";
    this.modalSupplies.show();
    this.form.get("supplies_code").setValue(row.supplies_code);
    this.form.get("name").setValue(row.name);
    this.form.get("quantity") .setValue(row.quantity);
    this.form.get("measure").setValue(row.measure);
    this.form.get("cost").setValue(row.cost, {emitEvent: false, onlySelf: true});
    this.form.get("taxes").setValue(row.taxes);
    this.form.get("total_cost").setValue(row.total_cost, {emitEvent: false, onlySelf: true});
    this.form.get("type").setValue(row.type);
    this.form.get("desc").setValue(row.desc);
    this.form.get("image").setValue(row.image);
    this.form.get("status").setValue(row.status);
    this.form.get("min_quantity").setValue(row.min_quantity);
    this.form.get("taxes_id").setValue(row.taxes_id, {emitEvent: false, onlySelf: true});
    this.form.get("provider_id").setValue(row.provider_id);
    this.currentRowId = row.id;

  }

  detail(row){
    this.mode = "Detalle"
    this.modalSupplies.show();
    this.currentSupplie = row;
  }

  cleanForm(){
    this.form.reset();
    this.form.get('status').setValue("activo");
    this.form.get('image').setValue("");
  }

  addSupplie(){
    this.cleanForm();
    this.mode = "Agregar";
    this.modalSupplies.show();
  }

  updateSupplie(){
    this.loadingIndicatorButton = true;
    this.manageTypes();
    this.requestSupplie.id = this.currentRowId;
    this._supplieService.updateSupplie(this.requestSupplie)
    .pipe(distinctUntilChanged())
    .subscribe((qw) => {
      
      this.toastr.success('Actualizar', 'El material se ha actualizado');
      this.modalSupplies.hide();
      this.loadItems();
      this.loadingIndicatorButton = false;
    });
    

  }

}
