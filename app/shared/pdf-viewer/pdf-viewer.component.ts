import { Component, Input, Output, ElementRef, EventEmitter } from '@angular/core';
import 'pdfjs-dist/build/pdf.combined';

@Component({
  selector: 'pdf-viewer',
  template: `<div class="ng2-pdf-viewer-container"  [ngClass]="{'ng2-pdf-viewer--zoom': zoom < 1}"></div>`,
  styles: [`
    .ng2-pdf-viewer--zoom {
        overflow-x: scroll;
    }
    .ng2-pdf-viewer-container{
        overflow:auto;
    }`
  ]
})

export class PdfViewerComponent {
  private _showAll: boolean = false;
  private _originalSize: boolean = true;
  private _src: string;
  private _pdf: any;
  private _page: any = 1;
  private _zoom: number = 1;
  private wasInvalidPage: boolean = false;
  @Input('on-load-complete') onLoadComplete: Function;
  @Output() pdferror = new EventEmitter<any>();
  constructor(private element: ElementRef) { }

  @Input() set src(_src: string) {
    this._src = _src;
    this.fn();
  }

  @Input() set page(_page: any) {
    _page = parseInt(_page, 10);

    if (!this._pdf) {
      return;
    }

    if (this.isValidPageNumber(_page)) {
      this._page = _page;
      this.renderPage(_page);
      this.wasInvalidPage = false;
    } else if (isNaN(_page)) {
      this.pageChange.emit(null);
    } else if (!this.wasInvalidPage) {
      this.wasInvalidPage = true;
      this.pageChange.emit(this._page);
    }
  }

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>(true);

  @Input('original-size')
  set originalSize(originalSize: boolean) {
    this._originalSize = originalSize;

    if (this._pdf) {
      this.fn();
    }
  }

  @Input('show-all')
  set showAll(value: boolean) {
    this._showAll = value;

    if (this._pdf) {
      this.fn();
    }
  }

  @Input('zoom')
  set zoom(value: number) {
    if (value <= 0) {
      return;
    }

    this._zoom = value;

    if (this._pdf) {
      this.fn();
    }
  }

  get zoom() {
    return this._zoom;
  }

  private fn() {
    (<any>window).PDFJS.getDocument(this._src).then((pdf: any) => {
      this._pdf = pdf;

      if (this.onLoadComplete && typeof this.onLoadComplete === 'function') {
        this.onLoadComplete(pdf);
      }

      if (!this.isValidPageNumber(this._page)) {
        this._page = 1;
      }

      if (!this._showAll) {
        return this.renderPage(this._page);
      }

      return this.renderMultiplePages();
    }).catch((ex: any) => {
       this.pdferror.emit(ex);
    });
  }

  private renderMultiplePages() {
    let container = this.element.nativeElement.querySelector('div');
    let page = 1;
    const renderPageFn = (page: number) => () => this.renderPage(page);

    this.removeAllChildNodes(container);

    let d = this.renderPage(page++);

    for (page; page <= this._pdf.numPages; page++) {
      d = d.then(renderPageFn(page));
    }
  }

  private isValidPageNumber(page: number) {
    if (this._pdf)
      return this._pdf.numPages >= page && page >= 1;

  }

  private renderPage(page: number) {
    debugger;
    return this._pdf.getPage(page).then((page: any) => {
      let viewport = page.getViewport(this._zoom);
      let container = this.element.nativeElement.querySelector('div');
      let canvas: HTMLCanvasElement = document.createElement('canvas');
        debugger;
      if (!this._originalSize) {
        viewport = page.getViewport(this.element.nativeElement.offsetWidth / viewport.width);
      }

      if (!this._showAll) {
        this.removeAllChildNodes(container);
      }

      container.appendChild(canvas);

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      page.render({
        canvasContext: canvas.getContext('2d'),
        viewport: viewport
      });
    });
  }

  private removeAllChildNodes(element: HTMLElement) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}