import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {ChatClientModule} from './chat-client.model';
import {ChatMessage} from './chat-message.model';
import {WelcomeDto} from './welcome.dto';
import {map} from 'rxjs/operators';
import {JoinChatDto} from './join-chat.dto';

@Injectable({
  providedIn: 'root'
})
export class ChatService {


  constructor(private socket: Socket) {
  }

  sendMessage(msg: string): void {
    this.socket.emit('message', msg);
  }

  sendTyping(typing: boolean): void {
    this.socket.emit('typing', typing);
  }

  listenForMessages(): Observable<ChatMessage> {
    return this.socket
      .fromEvent<ChatMessage>('newmessages');
  }

  listenForWelcome(): Observable<WelcomeDto> {
    return this.socket
      .fromEvent<WelcomeDto>('welcome');
  }

  listenForClientTyping(): Observable<ChatClientModule> {
    return this.socket
      .fromEvent<ChatClientModule>('clientTyping');
  }

  listenForErrors(): Observable<string> {
    return this.socket
      .fromEvent<string>('error');
  }

  listenForConnect(): Observable<string> {
    return this.socket
      .fromEvent<string>('connect')
      .pipe(map(() => {
        return this.socket.ioSocket.id;
      }));
  }

  listenForDisconnect(): Observable<string> {
    return this.socket
      .fromEvent<string>('disconnect')
      .pipe(map(() => {
        return this.socket.ioSocket.id;
      }));
  }

  listenForClients(): Observable<ChatClientModule[]> {
    return this.socket.fromEvent<ChatClientModule[]>('clients');
  }

  getAllMessages(): Observable<ChatMessage[]> {
    return this.socket.fromEvent<ChatMessage[]>('allMessages');
  }

  joinChat(dto: JoinChatDto): void {
    this.socket.emit('joinchat', dto);
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  connect(): void {
    this.socket.connect();
  }


}
