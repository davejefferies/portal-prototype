import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, SharedService } from '../../_services';
import { Message, MessageSeverities, MessageTypes, Reseller, User } from '../../_models';

@Component({
  selector: 'app-message-editor',
  templateUrl: './message-editor.component.html',
  styleUrls: ['./message-editor.component.scss']
})
export class MessageEditorComponent implements OnInit, OnDestroy {
  form: FormGroup;
	loading: boolean = false;
	submitted: boolean = false;
	resellers: Reseller[] = [];
	id: number;
	myInfo: User;
	subscriptions: any = [];
	severities: any = MessageSeverities;
	types: any = MessageTypes;
	objectKeys: any = Object.keys;
	type: number = 0;
	messages: Message[] = [];
	
  constructor( private alertService: AlertService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private sharedService: SharedService ) {
	  this.route.queryParams.subscribe((params: any) => {
		  if (params.type)
		    this.type = params.type;
		});
	  this.route.params.subscribe((params: any) => {
		  this.id = params.id;
		});
		
		this.subscriptions.push(this.sharedService.subscribe('my-info', (data) => {
			if (!data)
			  return;
			this.myInfo = data;
		}));
		
		this.subscriptions.push(this.sharedService.subscribe('resellers', (data) => {
			if (!data)
			  return;
			this.resellers = data;
		}));
		
		this.form = this.formBuilder.group({
		  id: [null],
			reseller: [0],
			subject: ['', Validators.required],
			body: ['', Validators.required],
			type: [this.type, Validators.required],
			severity: [0],
			created: [null],
			updated: [null]
		});
		
		this.subscriptions.push(this.sharedService.subscribe('messages', (messages: Message[]) => {
		  this.messages = messages;
		  if (this.id != null) {
			  let id = this.id;
			  let message: Message = messages.filter((obj) => { return obj.id == id; })[0];
				if (message) {
				  this.sharedService.publish('title-extra', '#' + message.id);
					this.form.controls['id'].setValue(message.id);
					this.form.controls['reseller'].setValue(message.reseller);
					this.form.controls['subject'].setValue(message.subject);
					this.form.controls['body'].setValue(message.body.replace(/\<br \/\>/g, "\n"));
					this.form.controls['type'].setValue(message.type);
					this.form.controls['severity'].setValue(message.severity);
					this.form.controls['created'].setValue(message.created);
					this.form.controls['updated'].setValue(message.updated);
				}
			}
		}));
	}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
	  this.subscriptions.forEach((sub: any) => {
		  sub.unsubscribe();
		});
	}
	
	get f() { return this.form.controls; }
	
	onSubmit() {
	  if (this.form.invalid)
		  return;
		
		let message: Message;
		
		let d = new Date();
		let date: string = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + ':' + (d.getSeconds() < 10 ? '0' : '') + d.getSeconds() + ' ' + (d.getDate() < 10 ? '0' : '') + d.getDate() + '-' + (d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1) + '-' + d.getFullYear();
		
		if (!this.form.value.id) {
		  let id = (this.messages.length == 0 ? 0 : this.messages[this.messages.length - 1].id) + 1;
			message = {
				id: id,
				reseller: this.form.value.reseller,
				subject: this.form.value.subject,
				body: this.form.value.body,
				type: this.form.value.type,
				severity: this.form.value.severity,
				created: date,
				status: 1
			};
			this.messages.push(message);
			this.alertService.success('Message has been added successfully.', true);
		} else {
		  let id = this.id;
		  let message: Message = this.messages.filter((obj) => { return obj.id == id; })[0];
			if (!message)
			  return this.alertService.error('An error occurred while updating the message.');
			message.subject = this.form.value.subject;
			message.body = this.form.value.body.replace(/(?:\r\n|\r|\n)/g, "<br />");
			message.type = this.form.value.type;
			message.severity = this.form.value.severity;
			message.updated = date;
			this.alertService.success('Message has been updated successfully.', true);
		}
		this.sharedService.publish('messages', this.messages);
		this.router.navigate(['/messages']);
	}
	
	goBack() {
	  return window.history.back();
	}
}
