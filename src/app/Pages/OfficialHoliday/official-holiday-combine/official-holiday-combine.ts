import { Component, ViewChild } from '@angular/core';
import { OfficialHolidayTableComponent } from '../official-holiday-table/official-holiday-table';
import { OfficialHolidayFormComponent } from '../official-holiday-form/official-holiday-form';

@Component({
  selector: 'app-official-holiday-combine',
  standalone: true,
  imports: [OfficialHolidayFormComponent, OfficialHolidayTableComponent],
  templateUrl: './official-holiday-combine.html',
  styleUrls: ['./official-holiday-combine.css']
})
export class OfficialHolidayCombineComponent {
  @ViewChild(OfficialHolidayTableComponent) table!: OfficialHolidayTableComponent;

  onAddHoliday(holiday: { name: string; date: string; }) {
    if (this.table) {
      this.table.holidays.push(holiday);
    }
  }
} 