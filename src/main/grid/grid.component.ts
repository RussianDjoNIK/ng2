import {Component, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import {TemplateCacheService} from 'ng2-qgrid/template';
import {RootComponent, RootService} from "ng2-qgrid/infrastructure/component";
import {LayerService} from '../layer'
import {Table} from 'ng2-qgrid/core/dom';

@Component({
  selector: 'q-grid',
  providers: [
    RootService,
    TemplateCacheService
  ],
  styles: [
    require('ng2-qgrid/assets/index.scss'),
    require('ng2-qgrid/theme/index.scss')
  ],
  template: require('./grid.component.html'),
  encapsulation: ViewEncapsulation.None
})
export class GridComponent extends RootComponent {
  @Input() model;
  @Input('rows') dataRows;
  @Input('columns') dataColumns;
  @Input('pipe') dataPipe;
  @Input('selection') selectionItems;
  @Input() selectionMode;
  @Input() selectionUnit;
  @Input() selectionKey;
  @Output() onSelectionChanged;
  @Input() groupBy;
  @Input() pivotBy;
  @Input() sortBy;
  @Input() sortMode;
  @Input() editMode;
  @Input() editEnter;
  @Input() editCommit;
  @Input() editCancel;
  @Input() editReset;
  @Input() styleRow;
  @Input() styleCell;
  @Input('actions') actionItems;

  @Output() selectionChanged = new EventEmitter<any>();

  constructor(private rootService: RootService) {
    super();

    this.models = ['data', 'selection', 'sort', 'group', 'pivot', 'edit', 'style', 'action'];
    this.modelChanged.watch(model => this.rootService.model = model);
  }

  ngOnInit() {
    super.ngOnInit();

    const markup = this.rootService.markup;
    const layerService = new LayerService(markup);
    const bag = this.rootService.bag;
    const model = this.rootService.model;

    const tableContext = {
      layer: name => layerService.create(name),
      model: element => bag.get(element) || null
    };

    this.rootService.table = new Table(model, markup, tableContext);

    this.model.viewChanged.watch(e => {
      if (e.hasChanges('columns')) {
        this.invalidateVisibility();
      }
    });
  }

  invalidateVisibility() {
    const columns = this.model.data().columns;
    const visibility = this.model.visibility;
    visibility({
      pin: {
        left: columns.some(c => c.pin === 'left'),
        right: columns.some(c => c.pin === 'right')
      }
    });
  }

  get visibility() {
    // TODO: get rid of that
    return this.model.visibility();
  }
}
