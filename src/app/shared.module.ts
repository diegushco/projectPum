import { PDFComponent } from './views/pdf/pdf.component';
import { LoadingIndicatorComponent, loadingButtonComponent } from './loadingIndicator.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// Angular
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { CurrencyMaskInputMode, NgxCurrencyModule } from "ngx-currency";

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

export const customCurrencyMaskConfig = {
  align: "left",
  allowNegative: false,
  allowZero: true,
  decimal: ",",
  precision: 2,
  prefix: "$ ",
  suffix: "",
  thousands: ".",
  nullable: true,
  min: null,
  max: null,
  inputMode: CurrencyMaskInputMode.NATURAL 
};

@NgModule({
  imports: [
    CommonModule,
    NgxUiLoaderModule,
    NgxMaskModule.forRoot(options),
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
  ],
  declarations: [
    LoadingIndicatorComponent, loadingButtonComponent, PDFComponent
  ],
  exports:[NgxCurrencyModule, NgxUiLoaderModule, LoadingIndicatorComponent, loadingButtonComponent, NgxMaskModule, PDFComponent],
})
export class SharedModule {

 }
