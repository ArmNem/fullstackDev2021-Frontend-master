import {ChangePriceDto} from '../shared/change-price.dto';

export class ListenForStocks {
  static readonly type = '[Stock] Listen For Stocks';
}

export class StopListeningForStocks {
  static readonly type = '[Stock] Stop Listening For Stocks';
}

export class UpdateStocks {
  constructor(public stocks: ChangePriceDto) {
  }
  static readonly type = '[Stock] Update Stocks';
}
