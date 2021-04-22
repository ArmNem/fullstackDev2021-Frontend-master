import {Injectable, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {Socket, SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule} from './shared/shared.module';
import {environment} from '../environments/environment';
import {NgxsModule} from '@ngxs/store';
import {ChatState} from './chat/state/chat.state';

const config: SocketIoConfig = {url: 'http://localhost:5000', options: {}};

@Injectable()
export class SocketChat extends Socket {

  constructor() {
    super({ url: 'http://localhost:3100', options: {} });
  }

}

@Injectable()
export class SocketStock extends Socket {

  constructor() {
    super({ url: 'http://localhost:3200', options: {} });
  }

}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    SharedModule,
    NgxsModule.forRoot([ChatState], {
      developmentMode: !environment.production
    })


  ],
  providers: [SocketStock],
  bootstrap: [AppComponent]
})
export class AppModule {
}
