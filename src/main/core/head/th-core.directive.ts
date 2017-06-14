import {Directive, ElementRef, Input, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {GRID_PREFIX} from 'ng2-qgrid/core/definition';
import {ViewCoreService} from 'ng2-qgrid/main/core/view';
import {TemplateCacheService, TemplateLinkService} from 'ng2-qgrid/template';
import {RootService} from "ng2-qgrid/infrastructure/component";

@Directive({
  selector: '[q-grid-core-th]'
})
export class ThCoreDirective implements OnInit, OnDestroy {
  @Input('q-grid-core-row-index') rowIndex: number;
  @Input('q-grid-core-column-index') columnIndex: number;
  private element: HTMLElement = null;
  private $implicit = this;

  constructor(public $view: ViewCoreService,
              private root: RootService,
              private templateCache: TemplateCacheService,
              private templateLink: TemplateLinkService,
              private viewContainerRef: ViewContainerRef,
              element: ElementRef) {

    this.element = element.nativeElement.parentNode;
  }

  ngOnInit() {
    const column = this.column;
    const element = this.element;

    this.root.bag.set(element, this);
    element.classList.add(`${GRID_PREFIX}-${column.key}`);
    element.classList.add(`${GRID_PREFIX}-${column.type}`);
    if (column.editor) {
      element.classList.add(`${GRID_PREFIX}-${column.editor}`);
    }

    const template =
      this.templateCache.get('head-cell-text.tpl.html') ||
      this.templateLink.get('head-cell-text.tpl.html');

    this.viewContainerRef.createEmbeddedView(template, this);
  }

  get column() {
    return this.row[this.columnIndex].model;
  }

  get row() {
    return this.$view.head.rows[this.rowIndex];
  }

  ngOnDestroy() {
    const element = this.element;
    this.root.bag.delete(element);
  }
}
