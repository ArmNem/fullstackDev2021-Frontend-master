import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ChatService} from './shared/chat.service';
import {Observable, Subject, Subscription} from 'rxjs';
import {debounceTime, take, takeUntil} from 'rxjs/operators';
import {ChatClientModule} from './shared/chat-client.model';
import {ChatMessage} from './shared/chat-message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  message = new FormControl('');
  messages: ChatMessage[] = [];
  sub: Subscription = new Subscription();
  unsub$ = new Subject();
  nameFC = new FormControl('');
  clients$: Observable<ChatClientModule[]> | undefined;
  chatClient: ChatClientModule | undefined;
  error$: Observable<string> | undefined;
  clientsTyping: ChatClientModule[] = [];
  socketID: string | undefined;

  constructor(private chatService: ChatService) {
  }

  ngOnInit(): void {
    this.message.valueChanges.pipe(takeUntil(this.unsub$), debounceTime(500)).subscribe((value) => {
      this.chatService.sendTyping(value.length > 0);
    });
    this.clients$ = this.chatService.listenForClients();
    this.error$ = this.chatService.listenForErrors();
    this.chatService.listenForMessages()
      .pipe(takeUntil(this.unsub$))
      .subscribe(message => {
        console.log('helo');
        this.messages.push(message);
      });
    this.chatService.listenForClientTyping().pipe(takeUntil(this.unsub$)).subscribe((chatClient) => {
      if (chatClient.typing && !this.clientsTyping.find((c) => c.id === chatClient.id)) {
        this.clientsTyping.push(chatClient);
      } else {
        this.clientsTyping = this.clientsTyping.filter((c) => c.id !== chatClient.id);
      }
    });
    this.chatService.listenForWelcome().pipe(takeUntil(this.unsub$)).subscribe(welcome => {
      this.messages = welcome.messages;
      this.chatClient = this.chatService.chatClient = welcome.client;
    });
    if (this.chatService.chatClient) {
      this.chatService.sendName(this.chatService.chatClient.name);
    }
    this.chatService.listenForConnect()
      .pipe(
        takeUntil(this.unsub$)
      ).subscribe((id) => {
      this.socketID = id;
    });
    this.chatService.listenForDisconnect()
      .pipe(
        takeUntil(this.unsub$)
      ).subscribe((id) => {
      this.socketID = id;
    });
  }


  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
  }

  sendMessage(): void {
    console.log(this.message.value);
    this.chatService.sendMessage(this.message.value);
    this.message.patchValue('');
  }

  sendName(): void {
    if (this.nameFC.value) {
      this.chatService.sendName(this.nameFC.value);
    }
  }
}
