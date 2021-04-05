import { Component } from '@angular/core';
import {StockService} from './stock/shared/stock.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chat-app-y2021-frontend';
  constructor(private stockService: StockService) {
    this.stockService.connect();
  }
}
