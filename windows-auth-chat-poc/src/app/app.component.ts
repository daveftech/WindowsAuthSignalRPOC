import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Message } from 'src/_models/message';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private hubConnection: HubConnection;
  title = 'Windows Auth/SignalR Chat POC';
  messages: Message[] = [];
  showConnecting = false;
  inputMessage: string;
  chatMessageFormControl: FormControl;

  ngOnInit() {
    console.log('Initializting...');
    this.hubConnection = new HubConnectionBuilder().withUrl('http://localhost:51723/chatHub').build();

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

    this.chatMessageFormControl = new FormControl('');
  }

  startConnection() {
    console.log('Starting connection...');
    this.showConnecting = true;
    this.hubConnection
    .start()
    .then(() => {
      console.log('Connection started...');
      this.showConnecting = false;
    })
    .catch(err => console.log('Error while establishing connection: ' + err));
  }

  onDisconnected() {
    console.log('Reconnecting in 5 seconds...');
    this.showConnecting = true;
    setTimeout(() => {
      this.startConnection();
    }, 5000);
  }

  sendMessage(text: string) {
    console.log('Sending message: ' + text);
    this.hubConnection.invoke('SendMessage', 'User', this.chatMessageFormControl.value);
    this.chatMessageFormControl.setValue('');
  }
}
