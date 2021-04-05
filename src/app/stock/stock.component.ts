import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {StockDto} from './shared/stock.dto';
import {StockService} from './shared/stock.service';
import {FormControl} from '@angular/forms';
import {ChangePriceDto} from './shared/change-price.dto';
import {map, takeUntil} from 'rxjs/operators';
import {AllStocksDto} from './shared/all-stock.dto';
import {Socket} from 'ngx-socket-io';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();
  stocks: StockDto[] | undefined;
  error$: Observable<string> | undefined;
  selectedStock: StockDto| undefined;
  priceFc = new FormControl('');

  constructor(private stockService: StockService) {
    // @ts-ignore
    this.stockService.getStocks();
  }


  ngOnInit(): void {
    this.error$ = this.stockService.listenForErrors();

    this.stockService.listenForStocks()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      // @ts-ignore
      .subscribe((dto) => {
        console.log(dto);
        this.stocks = dto.stocks;
        this.selectedStock = undefined;
      });
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
   // this.stockService.disconnect();
  }

  createStock(): void{
    const stock: StockDto = {name: 'microsoft', value: 448, description: 'good stock'};
    this.stockService.create(stock);
  }

  selectStock(stock: StockDto): void{
    this.selectedStock = stock;
    this.priceFc.setValue(stock.value);
  }

  changePrice(): void {
    if (this.selectedStock?.id && !Number.isNaN(this.priceFc.value)){
      const dto: ChangePriceDto = {id: this.selectedStock.id, newPrice: this.priceFc.value};
      this.stockService.changePrice(dto);
    }
  }

  updateStock(): void{

  }

  deleteStock(): void {
    this.stockService.deleteStock(this.selectedStock?.id);
  }
}
