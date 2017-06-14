import {Model, Command} from 'ng2-qgrid/core/infrastructure';
import {GridService as Grid} from 'ng2-qgrid/core/services';
import {Pipe} from 'ng2-qgrid/core/pipe';
import {PipeUnit} from 'ng2-qgrid/core/pipe/units';
import {noop} from 'ng2-qgrid/core/services/utility';
import {getFactory as valueFactory} from 'ng2-qgrid/core/services/value';
import {getFactory as labelFactory} from 'ng2-qgrid/core/services/label';
import {Injectable} from "@angular/core";

@Injectable()
export class GridService {
  constructor() {
  }

  model() {
    return new Model();
  }

  service(model) {
    const apply = noop;
    return new Grid(model, apply);
  }

  get pipe() {
    return Pipe;
  }

  get pipeUnit() {
    return PipeUnit;
  }

  get Command() {
    return Command;
  }

  get valueFactory() {
    return valueFactory;
  }

  get labelFactory() {
    return labelFactory;
  }
}
