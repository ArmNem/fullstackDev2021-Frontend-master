import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ChatService} from './shared/chat.service';
import {Observable, Subject, Subscription} from 'rxjs';
import {debounceTime, take, takeUntil} from 'rxjs/operators';
import {ChatClientModule} from './shared/chat-client.model';
import {ChatMessage} from './shared/chat-message.model';
import {JoinChatDto} from './shared/join-chat.dto';
import {StorageService} from '../shared/storage.service';
import {ChatState} from './state/chat.state';
import {Select, Store} from '@ngxs/store';
import {ChatClientLoggedIn, ListenForClients, LoadClientFromStorage, StopListeningForClients} from './state/chat.actions';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  @Select(ChatState.clients) clients$: Observable<ChatClientModule[]> | undefined;
  @Select(ChatState.clientIds) clientsIds$: Observable<string[]> | undefined;
  @Select(ChatState.loggedInClient) chatClient$: Observable<ChatClientModule> | undefined;

  messageFc = new FormControl('');
  nickNameFc = new FormControl('');

  messages: ChatMessage[] = [];
  clientsTyping: ChatClientModule[] = [];
  unsubscribe$ = new Subject();
  error$: Observable<string> | undefined;
  socketId: string | undefined;

  constructor(private store: Store,
              private chatService: ChatService) {
  }

  ngOnInit(): void {
    // this.clients$ = this.chatService.listenForClients();
    this.store.dispatch(new ListenForClients());
    this.error$ = this.chatService.listenForErrors();
    this.messageFc.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500)
      )
      .subscribe((value) => {
        this.chatService.sendTyping(value.length > 0);
      });
    this.chatService.listenForMessages()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(message => {
        this.messages.push(message);
      });
    this.chatService.listenForClientTyping()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((chatClient) => {
        if (chatClient.typing && !this.clientsTyping.find((c) => c.id === chatClient.id)) {
          this.clientsTyping.push(chatClient);
        } else {
          this.clientsTyping = this.clientsTyping.filter((c) => c.id !== chatClient.id);
        }
      });
    this.chatService.listenForWelcome()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(welcome => {
        this.messages = welcome.messages;
        this.store.dispatch(new ChatClientLoggedIn(welcome.client));
      });
    this.store.dispatch(new LoadClientFromStorage());
    this.chatService.listenForConnect()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((id) => {
        this.socketId = id;
      });
    this.chatService.listenForDisconnect()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((id) => {
        this.socketId = id;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.store.dispatch(new StopListeningForClients());
  }

  sendMessage(): void {
    this.chatService.sendMessage(this.messageFc.value);
    this.messageFc.patchValue('');
  }

  sendNickName(): void {
    if (this.nickNameFc.value) {
      const dto: JoinChatDto = {name: this.nickNameFc.value};
      this.chatService.joinChat(dto);
    }
  }
}
