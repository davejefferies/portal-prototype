import { Component, OnInit, OnDestroy } from '@angular/core';
//import { Help, HelpGroup, HelpGroups, User } from '../../_models';
import { ApiService, SharedService } from '../../_services';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit, OnDestroy {
  myInfo: any;
  items: any = [];
	groups: any = [];
	objectKeys: any = Object.keys;
	selectedGroup: any;
	drag_el: any;
	drag_item: any;
	drag_caq: boolean;
	loading: boolean;
	newItems: any = [];
	newQuestion: string;
	newAnswer: string;
	caq: boolean = false;
	caqItems: any = [];
	subscriptions: any = [];
	
  constructor( private apiService: ApiService, private sharedService: SharedService ) {
	  this.subscriptions.push(this.sharedService.subscribe('my-info', (details: any) => {
			this.myInfo = details;
		}));
		
		this.apiService.get('helps/groups').then((groups: any) => {
		  this.groups = groups;
		}).catch((error: any) => {});
		
		this.apiService.get('helps/caq').then((items: any) => {
		  this.caqItems = items.sort((a, b) => { return a.caq_priority - b.caq_priority; });
		}).catch((error: any) => {});
	}

  ngOnInit(): void {
	  this.items.forEach((item) => {
		  item.expanded = false;
			item.caq_expanded = false;
		});
  }
	
	ngOnDestroy(): void {
	  this.subscriptions.forEach((sub: any) => {
		  sub.unsubscribe();
		});
	}
	
	toggleItem(item: any) {
	  item.expanded = !item.expanded;
		if (item.expanded)
		  this.apiService.get('help/' + item.id).then((result: any) => {
			  if (result)
			    item.answer = result.answer;
			}).catch((error: any) => {
			
			});
	}

  toggleCaq(item: any) {
	  item.caq_expanded = !item.caq_expanded;
		if (item.caq_expanded)
		  this.apiService.get('help/' + item.id).then((result: any) => {
			  if (result)
			    item.answer = result.answer
			}).catch((error: any) => {
			
			});
	}
	
	groupExpand(group: any) {
		this.items.filter((obj) => { return obj.expanded; }).forEach((item: any) => {
		  item.expanded = false;
		});
	  this.selectedGroup = group;
		this.apiService.get('helps/group/' + this.selectedGroup.id).then((items: any) => {
		  this.items = items.sort((a, b) => { return a.priority - b.priority; });
		}).then((error: any) => {
		
		});
	}
	
	onDragStart(e: any, caq: boolean, item: any) {
	  if (this.myInfo.permissionLevel < 6000)
		  return;
	  e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData("text/plain", null);
		this.drag_el = e.target;
		this.drag_item = item;
		this.drag_caq = caq;
	}
	
	onDragOver(e: any, caq: boolean, item: any) {
	  if (this.myInfo.permissionLevel < 6000 || this.drag_caq != caq)
		  return;
	  e.preventDefault();
		
	  if (this.drag_item.id == item.id)
		  return;
		let prop = (caq ? 'caqItems' : 'items');
		let field = (caq ? 'caq_priority' : 'priority');
		let i: number = item[field];
		let n: number = this.drag_item[field];
		if (this.drag_item[field] > item[field]) {
		  this[prop].filter((obj) => { 
			  if (caq)
				  return obj.caq;
			  return obj.group == item.group; 
			}).forEach((item) => {
			  if (item[field] >= i && item[field] <= n) {
				  if (item[field] == n)
					  item[field] = i;
					else
					  item[field] = item[field] + 1;
				}
			});
		} else {
		  this[prop].filter((obj) => { 
			  if (caq)
				  return obj.caq;
			  return obj.group == item.group; 
			}).forEach((item) => {
			  if (item[field] >= n && item[field] <= i) {
				  if (item[field] == n)
					  item[field] = i;
					else
					  item[field] = item[field] - 1;
				}
			});
		}
		this[prop].sort((a, b) => { return a[field] - b[field]; });
		if (caq) {
		  this.caqItems.forEach((item) => {
			  let i = this.items.filter((obj) => { return obj.id == item.id; })[0];
				if (i)
				  i.caq_priority = item.caq_priority;
			});
		} else {
		  this.items.filter((obj) => { return obj.group_id == item.group_id; }).forEach((item) => {
			  let i = this.caqItems.filter((obj) => { return obj.id == item.id; })[0];
				if (i)
				  i.priority = item.priority;
			});
		}
	}
	
	onDragEnd(caq, item) {
	  let items: any = [];
		let gid = item.group_id;
		if (caq)
		  items = this.caqItems.map((obj) => { let i = JSON.parse(JSON.stringify(obj)); delete i.question; delete i.answer; return i; });
		else
		  items = this.items.filter((obj) => { return obj.group_id == gid; }).map((obj) => { let i = JSON.parse(JSON.stringify(obj)); delete i.question; delete i.answer; return i; });
		if (caq)
		  this.apiService.patch('help/update/caq', items).then((result) => {
			}).catch((error) => {
			  console.log(error);
			});
		else
		  this.apiService.patch('help/update', items).then((result) => {
			}).catch((error) => {
			  console.log(error);
			});
	}
	
	editQuestion(ev: any, item: any) {
	  ev.stopPropagation();
	  item.expanded = true;
		item.edit = true;
		item.tempQuestion = JSON.parse(JSON.stringify(item)).question;
		item.tempAnswer = JSON.parse(JSON.stringify(item)).answer;
		this.apiService.get('help/' + item.id).then((result: any) => {
		  if (result) {
		    item.answer = result.answer;
				item.tempAnswer = result.answer.replace(/\<br \/\>/g, "\n");
			}
		}).catch((error: any) => {});
	}
	
	save(ev: any, item: any) {
	  ev.stopPropagation();
		this.apiService.patch('help/update', {id: item.id, question: item.tempQuestion, answer: item.tempAnswer.replace(/(?:\r\n|\r|\n)/g, "<br />")}).then((result) => {
		  item.question = item.tempQuestion;
			item.answer = item.tempAnswer.replace(/(?:\r\n|\r|\n)/g, "<br />")
			item.edit = false;
			delete item.tempQuestion;
			delete item.tempAnswer;
			let a = this.caqItems.filter((obj) => { return obj.id == item.id; })[0];
			if (a) {
			  a.question = item.question;
				a.answer = item.answer;
			}
		}).catch((error) => {
		  console.log(error);
		});
	}
	
	cancelSave(ev: any, item: any) {
	  ev.stopPropagation();
		item.edit = false;
		delete item.tempQuestion;
		delete item.tempAnswer;
	}
	
	saveNew(ev: any) {
	  let item: any = {
	 	  group_id: this.selectedGroup.id,
		  question: this.newQuestion,
		  answer: this.newAnswer.replace(/(?:\r\n|\r|\n)/g, "<br />"),
		  caq: this.caq,
	  };
		this.apiService.post('help/new', item).then((result: any) => {
		  this.items.push(result);
			if (result.caq)
			  this.caqItems.push(result);
			this.newQuestion = null;
	    this.newAnswer = null;
		}).catch((error: any) => {
		  console.log(error);
		});
	}
	
	cancelNew(ev: any) {
	  this.newQuestion = null;
		this.newAnswer = null;
		this.caq = false;
	}
	
	addCaq(ev: any, item: any) {
	  ev.stopPropagation();
		item.caq = true;
		item.caq_priority = 1000000;
		this.apiService.patch('help/update/caq', this.items.filter((obj) => { return obj.caq; }).map((obj) => { let i = JSON.parse(JSON.stringify(obj)); delete i.question; delete i.answer; return i; })).then((result: any) => {
		  result.forEach((item) => {
			  if (item.caq) {
					let a = this.items.filter((obj) => { return obj.id == item.id; })[0];
					let b = this.caqItems.filter((obj) => { return obj.id == item.id; })[0];
					if (a) {
						a.caq = item.caq;
						a.caq_priority = item.caq_priority;
						if (!b)
							this.caqItems.push(a);
					}
				}
			});
		}).catch((error) => {
		  console.log(error);
		});
	}
	
	removeQuestion(ev: any, item: any) {
	  ev.stopPropagation();
		if (confirm('Are you sure you want to remove this question?')) {
			if (item.caq)
				this.removeCaq(ev, item, true);
			this.apiService.remove('help/' + item.id).then((result: any) => {
				let idx = this.items.map((obj) => { return obj.id; }).indexOf(item.id);
				if (idx > -1)
					this.items.splice(idx, 1);
				result.forEach((a) => {
					let b = this.items.filter((obj) => { return obj.id == a.id; })[0];
					if (b)
						b.priority = a.priority;
				});
			}).catch((error) => {
				console.log(error);
			});
		}
	}
	
	removeCaq(ev: any, item: any, bln: boolean = false) {
	  ev.stopPropagation();
	  if (this.myInfo.permissionLevel < 6000)
		  return;
	  if (bln || confirm('Are you sure you want to remove this question from the Commonly Asked Questions?')) {
			let i: number = item.caq_priority;
			let id: number = item.id;
			this.caqItems.forEach((item) => {
			  let n = this.items.filter((obj) => { return obj.id == item.id })[0];
				if (item.caq_priority >= i) {
					if (item.id == id) {
						item.caq_priority = 0;
						item.caq = false;
						let n = this.items.filter((obj) => { return obj.id == item.id })[0];
						if (n) {
						  n.caq = false;
							n.caq_priority = 0;
						}
					} else {
						item.caq_priority = item.caq_priority - 1;
						if (n)
						  n.caq_priority = item.caq_priority;
					}
				}
			});
			this.apiService.patch('help/update/caq', this.caqItems.map((obj) => { let i = JSON.parse(JSON.stringify(obj)); delete i.question; delete i.answer; return i; })).then((result: any) => {
			  this.caqItems = this.caqItems.filter((obj) => { return obj.caq });
			}).catch((error: any) => {});
		}
	}
}
