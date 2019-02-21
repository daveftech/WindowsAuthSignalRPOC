import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HubConnection, HubConnectionBuilder, IHttpConnectionOptions } from '@aspnet/signalr';
import { Message } from './_models/message';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './_services/auth.service';

import { ViewState } from './view-state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  private hubConnection: HubConnection;
  title = 'Windows Auth/SignalR Chat POC';
  messages: Message[] = [];
  viewState: ViewState;

  messageForm: FormGroup;

  constructor (private fb: FormBuilder, private httpClient: HttpClient, private authService: AuthService) {}

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    console.log('Initializting...');

    // Check that we're logged in.  If we aren't, then login
    console.log('Logging in...');
    if (!this.authService.loggedIn()) {
      this.authService.login();

      if (!this.authService.loggedIn()) {
        console.log('Authentication failed');
        this.authenticationFailed();
        return;
      }
    }

    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:51723/chatHub', { accessTokenFactory: () => localStorage.getItem('token') })
      .build();

    this.hubConnection.on('ReceiveMessage', (incomingName: string, incomingTimestamp: string, incomingMessage: string) => {
      console.log(`Message received: ${incomingMessage}`);
      const messageObj = {} as Message;
      messageObj.senderName = incomingName;
      messageObj.sentAt = new Date(incomingTimestamp).toTimeString();
      messageObj.text = incomingMessage ;

      this.messages.push(messageObj);
    });

    this.hubConnection.onclose(err => {
      this.onDisconnected();
    });

    this.startConnection();

    this.createMessageForm();
  }

  createMessageForm() {
    this.messageForm = this.fb.group({
      message: ['']
    });
  }

  startConnection() {
    console.log('Starting connection...');
    this.viewState = ViewState.Connecting;
    this.hubConnection
    .start()
    .then(() => {
      console.log('Connection started...');
      this.viewState = ViewState.Connected;
    })
    .catch(err => console.log('Error while establishing connection: ' + err));
  }

  onDisconnected() {
    console.log('Reconnecting in 5 seconds...');
    this.viewState = ViewState.Connecting;
    setTimeout(() => {
      this.startConnection();
    }, 5000);
  }

  sendMessage() {
    console.log('Sending message...');
    if (this.messageForm.valid) {
      console.log('messageForm was valid.  Continuing to send message.');
      const messageFormObj = Object.assign({}, this.messageForm.value);

      console.log(`Message to send: ${messageFormObj.message}`);
      this.hubConnection.invoke('SendMessage', 'User', messageFormObj.message);

      this.messageForm.reset();
    } else {
      console.log('messageForm was not valid');
    }

  }

  authenticationFailed() {
    this.viewState = ViewState.Unauthorized;
  }
}
