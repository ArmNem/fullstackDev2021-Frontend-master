import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StockCreateComponent} from './stock-create/stock-create.component';
import {StockComponent} from './stock.component';
import {StockRoutingModule} from './stock-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';



@NgModule({
  declarations: [StockComponent, StockCreateComponent],
  imports: [
    CommonModule,
    StockRoutingModule,
    ReactiveFormsModule,
    MatCardModule
  ]
})
export class StockModule { }
