import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'pagination',
  templateUrl: 'pagination.html'
})
export class PaginationComponent {
  @Input() pageNumber: number;
  @Input() pageCount: number;
  @Output() pageChanged = new EventEmitter<number>();
  constructor() { }
  enablePages() {
    return (this.pageCount > 0) ? true : false;
  }
  prevPageDisabled() {
    return this.pageNumber === 0 ? true : false;
  }
  nextPageDisabled() {
    return ((this.pageCount == 0) || (this.pageNumber === this.pageCount - 1)) ? true : false;
  }
  prevPage() {
    if (this.pageNumber > 0) {
      this.pageNumber--;
      this.pageChanged.emit(this.pageNumber);
    }
  }
  nextPage() {
    if (this.pageNumber < this.pageCount - 1) {
      this.pageNumber++;
      this.pageChanged.emit(this.pageNumber);
    }
  }
}