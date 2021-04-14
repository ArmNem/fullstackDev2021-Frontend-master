import {Injectable} from '@angular/core';
import {ChatClientModule} from '../chat/shared/chat-client.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {
  }

  saveChatClient(chatClient: ChatClientModule): void {
    localStorage.setItem('client', JSON.stringify(chatClient));
  }

  loadChatClient(): ChatClientModule | undefined {
    const chatClientString = localStorage.getItem('client');
    if (chatClientString) {
      const chatClient: ChatClientModule = JSON.parse(chatClientString);
      return chatClient;
    }
    return undefined;
  }
}
