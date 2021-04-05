import {StockCreateComponent} from './stock-create/stock-create.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StockComponent} from './stock.component';

const routes: Routes = [
  { path: '', component: StockComponent },
  { path: 'create', component: StockCreateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule { }
