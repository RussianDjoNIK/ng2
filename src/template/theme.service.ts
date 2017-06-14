import {Injectable} from '@angular/core';
import {Event} from 'ng2-qgrid/core/infrastructure';

@Injectable()
export class ThemeService {
  changed = new Event();
  private themeName = '';

  constructor() {
  }

  get name(): string {
    return this.themeName;
  }

  set name(value: string) {
    if (value !== this.themeName) {
      this.themeName = value;
      this.changed.emit({
        newValue: value,
        oldValue: value
      });
    }
  }
}
