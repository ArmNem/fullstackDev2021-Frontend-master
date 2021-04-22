import {ChatClientModule} from '../../chat/shared/chat-client.model';
import {StockDto} from '../shared/stock.dto';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {ChatStateModel} from '../../chat/state/chat.state';
import {Injectable} from '@angular/core';
import {ListenForClients, StopListeningForClients, UpdateClients} from '../../chat/state/chat.actions';
import {ListenForStocks, StopListeningForStocks, UpdateStocks} from './stock.actions';
import {Subscription} from 'rxjs';
import {ChatService} from '../../chat/shared/chat.service';
import {StockService} from '../shared/stock.service';
import {ChangePriceDto} from '../shared/change-price.dto';

export interface StockStateModel {
  stocks: StockDto[];
  updatestock: ChangePriceDto | undefined;
}

@State<StockStateModel>({
  name: 'stock',
  defaults: {
    stocks: [],
    updatestock: undefined,
  }
})

@Injectable()
export class StockState {
  private stocksUnsub: Subscription | undefined;

  constructor(private stockService: StockService) {
  }

  @Selector()
  static stocks(state: StockStateModel): StockDto[] {
    return state.stocks;
  }

  /*@Action(ListenForStocks)
  getClients(ctx: StateContext<StockStateModel>): void {
    this.stocksUnsub = this.stockService.listenForStocks()
      .subscribe(stocks => {
        ctx.dispatch(new UpdateStocks(stocks));
      });
  }*/

  @Action(UpdateStocks)
  updateStocks(ctx: StateContext<StockStateModel>, uc: UpdateStocks): void {
    const state = ctx.getState();
    const newState: StockStateModel = {
      ...state,
      updatestock: uc.stocks
    };
    ctx.setState(newState);
  }
  @Action(StopListeningForStocks)
  stopListeningForStocks(ctx: StateContext<StockStateModel>): void {
    if (this.stocksUnsub) {
      this.stocksUnsub.unsubscribe();
    }
  }
}
