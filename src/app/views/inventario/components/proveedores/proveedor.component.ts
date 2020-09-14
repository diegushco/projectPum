import { cityService } from './../../../../services/city.service';
import { DepartmentService } from './../../../../services/department.service';
import { ProviderService } from '../../../../services/provider.service';
import { Component, OnInit, ViewChild, Provider } from "@angular/core";
import { Observable, combineLatest, fromEvent } from "rxjs";
import { tap, filter, debounceTime, map, distinctUntilChanged } from "rxjs/operators";
import { ModalDirective } from "ngx-bootstrap/modal";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { IProvider } from '../../../../interfaces/provider.interface';

@Component({
  selector: "app-proveedor",
  templateUrl: "proveedor.component.html",
  styleUrls: ["proveedor.component.css"]
})
export class ProveedorComponent implements OnInit {
  @ViewChild("modalProvider") public modalProvider: ModalDirective;
  @ViewChild('search', { static: false }) search: any;
  @ViewChild("modalAlert") public modalAlert: ModalDirective;

  rows: any = [];
  rowsCopy:any = [];
  columns: any = [
    'provider_code',
    'name',
    'nit',
    'city_name',
    'address',
    'email',
    'phone1',
  ];
  columnsText:any = [
    "Cod", "Nombre", "NIT", "Ciudad", "Direccion", "Correo", "Telefono"
  ];
  currentRowId: number;

  requestProvider: IProvider;

  currentProvider: IProvider;

  listProviders$: Observable<any>;

  form = new FormGroup({
    provider_code: new FormControl(null),
    name: new FormControl(null, Validators.required),
    nit: new FormControl(null, Validators.required),
    departmentId: new FormControl(null, Validators.required),
    cityId  : new FormControl(null, Validators.required),
    address: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required,
      Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")
    ]),
    phone1: new FormControl(null, Validators.required),
    phone2: new FormControl(null),
    website: new FormControl(null, 
      Validators.pattern("(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?")
      ),
  });

  forRemoved:any;

  mode = "Agregar";

  department$:Observable<any>;

  deparments:any;

  cities:any;

  loadingIndicatorTable = false;
  loadingIndicatorButton = false;

  constructor(
    private _providerService: ProviderService,
    private toastr: ToastrService,
    private _departmentService:DepartmentService,
    private _cityService:cityService
  ) {}

  ngOnInit() {
    this.loadItems();
    this.form.get("departmentId").valueChanges.subscribe((bn)=>{
      //this.form.get("cityId ").reset();
      this._cityService.getCityByDeparment(bn).subscribe((cities)=>{
        this.cities = cities;
      });
    });

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

  loadItems() {

    this.loadingIndicatorTable = true;
    this.listProviders$ = combineLatest(this._providerService.getAllProvider(), this._departmentService.getAllDeparment()).
    pipe(tap((x)=>{
      this.rows = x[0];
      this.rowsCopy = [...this.rows];
      this.deparments = x[1];

      this.rows.forEach(element => {
        element.department_name = this.deparments.filter(rt => (element.departmentId === rt.id))[0].name;
        this._cityService.getCityByDeparment(element.departmentId).subscribe((op:any[])=>{
          element.city_name = op.filter(kl => kl.id === element.cityId  )[0].name;
        });
      });
      this.loadingIndicatorTable = false;
    }));


  }

  removed(row){
    this.loadingIndicatorButton = true;
    this._providerService.deleteProviderById(row.id).subscribe(xc => {
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
    this.requestProvider = this.form.getRawValue();
    this.requestProvider.departmentId = parseInt(
      this.requestProvider.departmentId.toString()
    );
    this.requestProvider.cityId  = parseInt(
      this.requestProvider.cityId .toString()
    );
    
  }

  saveProvider() {
    this.loadingIndicatorButton = true;
    this.manageTypes();
    delete this.requestProvider.provider_code;

    this._providerService.saveProvider(this.requestProvider)
      .pipe(distinctUntilChanged())
      .subscribe(gh => {
      this.toastr.success("Guardar", "El prveedor se ha guardado");
      this.modalProvider.hide();
      this.loadItems();
      this.loadingIndicatorButton = false;
    });
  }

  edit(row) {
    this.mode = "Editar";
    this.modalProvider.show();
    
    this.form.get("provider_code").setValue(row.provider_code);
    this.form.get("name").setValue(row.name);
    this.form.get("nit").setValue(row.nit);
    this.form.get("departmentId").setValue(row.departmentId);
    this.form.get("cityId").setValue(row.cityId);
    this.form.get("address").setValue(row.address);
    this.form.get("email").setValue(row.email);
    this.form.get("phone1").setValue(row.phone1);
    this.form.get("phone2").setValue(row.phone2);
    this.form.get("website").setValue(row.website);
    this.currentRowId = row.id;
    this.form.get('provider_code').disable();
    
  }

  detail(row) {
    this.mode = "Detalle";
    this.modalProvider.show();
    this.currentProvider = row;
  }

  addProvider() {
    this.form.reset();
    this.mode = "Agregar";
    this.modalProvider.show();
    this.form.get('provider_code').enable();
  }

  updateProvider() {
    this.loadingIndicatorButton = true;
    this.manageTypes();
    this.requestProvider.id = this.currentRowId;
    this._providerService.updateProvider(this.requestProvider)
      .pipe(distinctUntilChanged())
      .subscribe(qw => {
      this.toastr.success("Actualizar", "El proveedor se ha actualizado");
      this.modalProvider.hide();
      this.loadItems();
      this.loadingIndicatorButton = false;
    });
  }
}
