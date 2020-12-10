import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'live-chat',
  templateUrl: './live-chat.component.html',
  styleUrls: ['./live-chat.component.scss']
})
export class LiveChatComponent implements OnInit {
  clicked: boolean = false;
	
  constructor() { }

  ngOnInit(): void {
  }

  toggle() {
	  this.clicked = !this.clicked;
	}
}
