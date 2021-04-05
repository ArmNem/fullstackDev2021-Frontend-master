import {Injectable} from '@angular/core';
import {CreateStockDto} from './create-stock.dto';
import {Observable} from 'rxjs';
import {StockDto} from './stock.dto';
import {AllStocksDto} from './all-stock.dto';
import {ChangePriceDto} from './change-price.dto';
import {Socket} from 'ngx-socket-io';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private socketStocks: Socket) { }

  create(stock: CreateStockDto): void {
    this.socketStocks.emit('create-stock', stock);
  }


  getStocks(): any {

    console.log('losl');
    this.socketStocks.emit('allStocks', 'non');
  }

  listenForErrors(): Observable<string>{
    return this.socketStocks
      .fromEvent<string>('error');
  }

  listenForStocks(): any{
    return this.socketStocks
      .fromEvent<AllStocksDto>('allStocks').pipe(map((data) => {
        return data;
      }));
  }

  disconnect(): void{
    this.socketStocks.disconnect();
  }

  connect(): void{
    this.socketStocks.connect();
  }

  deleteStock(id: string | undefined): void {
    this.socketStocks.emit('delete-stock', id);
  }

  changePrice(dto: ChangePriceDto): void {
    this.socketStocks.emit('price-change', dto);
  }
}
