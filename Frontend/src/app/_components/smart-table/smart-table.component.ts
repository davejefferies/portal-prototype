import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../_services';

@Component({
  selector: 'smart-table',
  templateUrl: 'smart-table.component.html',
  styleUrls: ['./smart-table.component.scss']
})
export class SmartTableComponent implements OnInit {
  data: any = [];
  columns: any = [];
  chunks: any = [];
  @Input('columns')
  set col(columns: any) {
    this.columns = columns;
    this.columns.forEach((col) => {
      col.topSort = '#ababab';
      col.bottomSort = '#ababab';
    });
		let col = this.columns.filter((obj) => { return obj.name == 'Options'; })[0];
		if (col.extraParams)
		  this.extraParams = col.extraParams;
		else
		  this.extraParams = null;
  }
  @Input('data') 
  set in(data: any) {
    if (!this.isEqual(this.data, data)) {
      this.data = data;
      this.currentPage = 1;
      this.refresh();
      this.createPaginator();
    }
  }
  @Input() sortBy: string = '';
	@Input() messages: boolean = false;
	@Output() onDeactivate = new EventEmitter();
  @Output() onDelete = new EventEmitter();
	@Output() onUpdate = new EventEmitter();
	@Output() onCallback = new EventEmitter();
	@Output() onMarkRead = new EventEmitter();
  searchBy: string = '';
  sortAsc: boolean = true;
  filteredData: any = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  deleteCheck: boolean = false;
  pager: any = [];
  paginationMax: number = 10;
  params: any = {};
	extraParams: any;

  constructor( private apiService: ApiService, private route: ActivatedRoute ) {
    this.route.queryParams.subscribe(params => {
      this.params = params;
    });
  }

  ngOnInit(): void {
  }

  getColumnData(item: any, column: any) {
    if (column && !column.sublink)
      return (column.prefix ? column.prefix : '') + (column.bln2Str ? (item ? 'YES' : 'NO') : (item ? item : ''));
    else if (column && column.sublink)
      return (column.prefix ? column.prefix : '') + (column.bln2Str ? (item && item[column.sublink] ? 'YES' : 'NO') : (item && item[column.sublink] ? item[column.sublink] : ''));
    else
      return '';
  }
  
  isAddEnabled() {
    let a = this.columns.filter((obj) => { return obj.name == 'Options'; })[0];
    if (a && a.add)
      return true;
    return false;
  }
	
	isDeactivateEnabled() {
    let a = this.columns.filter((obj) => { return obj.name == 'Options'; })[0];
    if (a && a.deactivate)
      return true;
    return false;
  }
  
  isDeleteEnabled() {
    let a = this.columns.filter((obj) => { return obj.name == 'Options'; })[0];
    if (a && a.delete)
      return true;
    return false;
  }
	
	isEnabled(str: string) {
    let a = this.columns.filter((obj) => { return obj.name == 'Options'; })[0];
    if (a && a[str])
      return true;
    return false;
  }
  
  deleteAllChange(ev: boolean) {
    this.filteredData.forEach((item: any) => {
      item.delete = this.deleteCheck;
    });
  }
  
  deleteSingleChange(ev: any) {
    this.deleteCheck = false;
  }
	
	stopProp(ev: any) {
	  ev.stopPropagation();
	}
	
	deactivateDisabled() {
    if (this.filteredData.filter((obj) => { return obj.delete; }).length > 0)
      return false;
    return true;
  }
  
  deleteDisabled() {
    if (this.filteredData.filter((obj) => { return obj.delete; }).length > 0)
      return false;
    return true;
  }
  
  deleteCount() {
    return this.filteredData.filter((obj) => { return obj.delete; }).length;
  }
	
	deactivateClick() {
    let items = this.filteredData.filter((obj) => { return obj.delete; }).map((obj) => { return obj.id; });
    if (items.length == 0)
      return;
    if (confirm('Are you sure you want to deactivate the selected items?'))
      this.onDeactivate.emit(items);
  }
  
  deleteClick() {
    let items = this.filteredData.filter((obj) => { return obj.delete; }).map((obj) => { return obj.id; });
    if (items.length == 0)
      return;
    if (confirm('Are you sure you want to delete the selected items?'))
      this.onDelete.emit(items);
  }
	
	markReadClick() {
	  let items = this.filteredData.filter((obj) => { return obj.delete; }).map((obj) => { return obj.id; });
    if (items.length == 0)
      return;
    if (confirm('Are you sure you want to mark the selected items as read?'))
      this.onMarkRead.emit(items);
	}
  
  goPrevious() {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1;
      this.createPaginator();
    }
  }
  
  goNext() {
    if (this.currentPage < this.chunks.length) {
      this.currentPage = this.currentPage + 1;
      this.createPaginator();
    }
  }
  
  goToPage(page: number) {
    if (this.currentPage > 0 && this.currentPage <= this.chunks.length) {
      this.currentPage = page;
      this.createPaginator();
    }
  }
  
  perPageChange(ev) {
    this.itemsPerPage = parseInt(ev);
    this.currentPage = 1;
    this.refresh();
    this.createPaginator(); 
  }
  
  sortData(column: any) {
    if (!column.sortable)
      return;
    if (this.sortBy != column.link) {
      this.sortBy = column.link;
      this.sortAsc = true;
    } else {
      this.sortAsc = !this.sortAsc;
    }
    this.refresh();
  }
  
  searchChange() {
    this.currentPage = 1;
    this.refresh();
  }
  
  refresh() {
    let sortFunc = () => {
      let column = this.columns.filter((obj) => { return obj.link == this.sortBy; })[0];
      if (!column)
        return;
      return (a, b) => {
        if (!a.hasOwnProperty(column.link) || !b.hasOwnProperty(column.link))
          return 0;
        let varA = (typeof a[column.link] === 'string') ? a[column.link].toUpperCase() : a[column.link];
        let varB = (typeof b[column.link] === 'string') ? b[column.link].toUpperCase() : b[column.link];
        if (column.sublink) {
          varA = (typeof a[column.link][column.sublink] === 'string') ? a[column.link][column.sublink].toUpperCase() : a[column.link][column.sublink];
          varB = (typeof b[column.link][column.sublink] === 'string') ? b[column.link][column.sublink].toUpperCase() : b[column.link][column.sublink];
        }

        let comparison = 0;
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
        return (
          !this.sortAsc ? (comparison * -1) : comparison
        );
      };
    };
    this.data.sort(sortFunc());
    let d = this.data;
    if (this.searchBy && this.searchBy != '') {
      let f = this.columns.filter((obj) => { return obj.filter; });
      d = this.data.filter((obj) => { 
        let bln = false;
        f.forEach((g) => {
          if (obj[g.link] && typeof(obj[g.link]) == 'object') {
            if (obj[g.link][g.sublink] && obj[g.link][g.sublink].toLowerCase().indexOf(this.searchBy.toLowerCase()) > -1)
              bln = true;
          } else if (obj[g.link]) {
            if (obj[g.link] && obj[g.link].toLowerCase().indexOf(this.searchBy.toLowerCase()) > -1)
              bln = true;
          }
        });
        return bln;
      });
    }
    this.chunks = this.chunkBreakdown(d, this.itemsPerPage);
    if (this.chunks.length == 0)
      this.filteredData = [];
    else
      this.filteredData = this.chunks[this.currentPage - 1];
    if (this.chunks.length < 2)
      return;
  }
  
  createPaginator() {
    this.pager = [];

    this.chunks.forEach((chunk, idx) => {
      let page: number = idx + 1;
      if (page == 1 || page == this.chunks.length || this.chunks.length <= 10 || 
        (this.currentPage <= 5 && page <= 8) || (this.currentPage > 5 && page > this.currentPage - 4 && page < this.currentPage + 3)
         || (this.currentPage + 3 >= this.chunks.length && page >= this.chunks.length - 7))
        this.pager.push({number: page, idx: idx});
      else if (page == 2 || idx == this.chunks.length - 2)
        this.pager.push({idx: idx, ellipsis: true});
    });
    if (this.chunks.length == 0)
      this.filteredData = [];
    else
      this.filteredData = this.chunks[this.currentPage - 1];
  }
  
  isEqual(value, other) {
	  let self = this;
    var type = Object.prototype.toString.call(value);
    if (type !== Object.prototype.toString.call(other)) return false;
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;
    var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) return false;
    var compare = function (item1, item2) {
      var itemType = Object.prototype.toString.call(item1);
      if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
        if (!self.isEqual(item1, item2)) return false;
      } else {
        if (itemType !== Object.prototype.toString.call(item2)) return false;
        if (itemType === '[object Function]')
          if (item1.toString() !== item2.toString()) return false;
        else
          if (item1 !== item2) return false;
      }
    };

    if (type === '[object Array]') {
      for (var i = 0; i < valueLen; i++) {
        if (compare(value[i], other[i]) === false) return false;
      }
    } else {
      for (var key in value) {
        if (value.hasOwnProperty(key)) {
          if (compare(value[key], other[key]) === false) return false;
        }
      }
    }

    return true;

  }
  
  chunkBreakdown(arr: any, len: number) {
    var chunks = [],
        i = 0,
        n = arr.length;
    while (i < n) {
      chunks.push(arr.slice(i, i += len));
    }

    return chunks;
  }
	
	combineParams(item) {
	  let obj: any = {};
		let p = this.params;
		let q = this.getParams(this.extraParams, item);
		
		Object.keys(p).forEach((key) => {
		  obj[key] = p[key];
		});
		
		if (q)
			Object.keys(q).forEach((key) => {
				obj[key] = q[key];
			});
		
		return obj;
	}
  
  getParams(params, item) {
    let obj: any = {};
    if (!params)
		  return;
    Object.keys(params).forEach((key: string) => {
		  //console.log(key);
      if (params[key] in item)
        obj[key] = item[params[key]];
      else
        obj[key] = params[key];
    });
    
    return obj;
  }
	
	rowExpand(item: any) {
	  if (!this.messages)
		  return;
		item.expanded = !item.expanded;
		item.status = 2;
		this.onUpdate.emit();
	}
	
	runCallback(event: any, item: any) {
		this.onCallback.emit({event, item});
	}
}
