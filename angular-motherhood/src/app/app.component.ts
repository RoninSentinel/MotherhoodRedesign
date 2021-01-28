import { Component, OnInit } from '@angular/core';
import { AlertService } from './shared/components/alert-notifications';
import { CalendarOptions } from '@fullcalendar/angular';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'; // a plugin
import Echo from 'laravel-echo';
import { WebsocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private _websocketBroadcastSubscription;

  constructor(
    protected alertService: AlertService,
    private websocketService: WebsocketService,
  ) { }

  ngOnInit() {
    window['Echo'] = new Echo({
      broadcaster: 'socket.io',
      //host: 'http://localhost:6001',
      host: window.location.hostname + ':6001',
    });

    this._websocketBroadcastSubscription = this.websocketService.messageToBroadcast$.subscribe(data => {
      this.broadcastWhisper(data);
    });

    this.listenForBroadcasts();

  }

  ngOnDestroy() {
    this._websocketBroadcastSubscription?.unsubscribe();
    window['Echo'].leave('motherhood');
    window['Echo'].leave('private-motherhood');
  }

  listenForBroadcasts() {
    window['Echo'].channel('motherhood').listen('.published', (message) => {
      this.websocketService.messageProcessor('published', message);
    });

    window['Echo'].private('motherhood').listenForWhisper('.notifications', (message) => {
      this.websocketService.messageProcessor('notifications', message.message);
    });
  }

  broadcastWhisper(message) {
    // Whispers bypass the backend database/api.
    window['Echo'].private('motherhood').whisper('.notifications', {
      message
    });
  }

}
