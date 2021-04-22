import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {WelcomeDto} from '../shared/welcome.dto';
import {ChatClientModule} from '../shared/chat-client.model';
import {ChatClientLoggedIn, ListenForClients, LoadClientFromStorage, StopListeningForClients, UpdateClients} from './chat.actions';
import {ChatService} from '../shared/chat.service';
import {Subscription} from 'rxjs';

export interface ChatStateModel {
  chatClients: ChatClientModule[];
  loggedInClient: ChatClientModule | undefined;
}

@State<ChatStateModel>({
  name: 'chat',
  defaults: {
    chatClients: [],
    loggedInClient: undefined,
  }
})
@Injectable()
export class ChatState {
  private clientsUnsub: Subscription | undefined;

  constructor(private chatService: ChatService) {
  }

  @Selector()
  static loggedInClient(state: ChatStateModel): ChatClientModule |undefined {
    return state.loggedInClient;
  }

  @Selector()
  static clients(state: ChatStateModel): ChatClientModule[] {
    return state.chatClients;
  }

  @Selector()
  static clientIds(state: ChatStateModel): string[] {
    return state.chatClients.map(c => c.id);
  }

  @Selector()
  static clientsOnline(state: ChatStateModel): number {
    return state.chatClients.length;
  }

  @Action(ListenForClients)
  getClients(ctx: StateContext<ChatStateModel>): void {
    this.clientsUnsub = this.chatService.listenForClients()
      .subscribe(clients => {
        ctx.dispatch(new UpdateClients(clients));
      });
  }

  @Action(StopListeningForClients)
  stopListeningForClients(ctx: StateContext<ChatStateModel>): void {
    if (this.clientsUnsub) {
      this.clientsUnsub.unsubscribe();
    }
  }

  @Action(UpdateClients)
  updateClients(ctx: StateContext<ChatStateModel>, uc: UpdateClients): void {
    const state = ctx.getState();
    const newState: ChatStateModel = {
      ...state,
      chatClients: uc.clients
    };
    ctx.setState(newState);
  }

  @Action(ChatClientLoggedIn)
  chatClientLoggedIn(ctx: StateContext<ChatStateModel>, clientLoggedInAction: ChatClientLoggedIn): void {
    const state = ctx.getState();
    const newState: ChatStateModel = {
      ...state,
      loggedInClient: clientLoggedInAction.client
    };
    ctx.setState(newState);
  }

  @Action(LoadClientFromStorage)
  loadClientFromStorage(ctx: StateContext<ChatStateModel>): void {
    const state = ctx.getState();
    const client = state.loggedInClient;
    if (client) {
      this.chatService.joinChat({
        id: client.id,
        name: client.name
      });
    }
  }


}
