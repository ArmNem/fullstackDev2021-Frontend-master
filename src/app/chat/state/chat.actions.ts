import {ChatClientModule} from '../shared/chat-client.model';

export class ListenForClients {
  static readonly type = '[Chat] Listen For Clients';
}

export class StopListeningForClients {
  static readonly type = '[Chat] Stop Listening For Clients';
}

export class UpdateClients {
  constructor(public clients: ChatClientModule[]) {
  }

  static readonly type = '[Chat] Update Clients';
}

export class ChatClientLoggedIn {
  constructor(public client: ChatClientModule) {
  }

  static readonly type = '[Chat] New ChatClient Logged In';
}

export class LoadClientFromStorage {
  static readonly type = '[Chat] Load ChatClient From Storage';
}
