import {ChatMessage} from './chat-message.model';
import {ChatClientModule} from './chat-client.model';

export interface WelcomeDto {
  clients: ChatClientModule[];
  client: ChatClientModule;
  messages: ChatMessage[];
}
