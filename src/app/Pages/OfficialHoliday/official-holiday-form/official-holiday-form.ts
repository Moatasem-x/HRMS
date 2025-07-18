import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-official-holiday-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './official-holiday-form.html',
  styleUrls: ['./official-holiday-form.css']
})
export class OfficialHolidayFormComponent {
  name = '';
  date = '';

  @Output() addHoliday = new EventEmitter<{ name: string; date: string; }>();

  submit() {
    if (this.name && this.date) {
      this.addHoliday.emit({ name: this.name, date: this.date });
      this.name = '';
      this.date = '';
    }
  }
}
