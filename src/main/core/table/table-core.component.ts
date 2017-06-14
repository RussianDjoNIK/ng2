import {OnInit, Component, Input} from "@angular/core";
import {ViewCoreService} from 'ng2-qgrid/main/core/view';
import {RootService} from 'ng2-qgrid/infrastructure/component';

@Component({
  selector: 'q-grid-core-table',
  template: require('./table-core.component.html')
})
export class TableCoreComponent implements OnInit {
  @Input() public pin = null;

  constructor(private root: RootService) {
  }

  ngOnInit() {
    if (!this.pin) {
      this.pin = null;
    }
  }

  get columnStartIndex() {
    const columns = this.root.table.data.columns();
    switch (this.pin) {
      case 'left':
        return 0;
      case 'right':
        return columns.filter(c => c.pin !== 'right').length;
      default:
        return columns.filter(c => c.pin === 'left').length;
    }
  }

  get visibility() {
    return this.model.visibility();
  }

  get model() {
    return this.root.model;
  }
}
