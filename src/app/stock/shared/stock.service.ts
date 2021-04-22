import {Injectable} from '@angular/core';
import {CreateStockDto} from './create-stock.dto';
import {Observable} from 'rxjs';
import {StockDto} from './stock.dto';
import {AllStocksDto} from './all-stock.dto';
import {ChangePriceDto} from './change-price.dto';
import {Socket} from 'ngx-socket-io';
import {map} from 'rxjs/operators';
import {ChatClientModule} from '../../chat/shared/chat-client.model';

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

  listenForStocks(): Observable<StockDto[]>{
   /* return this.socketStocks
      .fromEvent<AllStocksDto>('allStocks').pipe(map((data) => {
        return data;
      }));*/
    return this.socketStocks.fromEvent<StockDto[]>('stocks');
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
