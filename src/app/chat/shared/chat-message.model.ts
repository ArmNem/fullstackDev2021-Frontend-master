import {ChatClientModule} from './chat-client.model';

export interface ChatMessage {
  message: string;
  sender: ChatClientModule;
}
