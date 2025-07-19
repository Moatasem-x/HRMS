import { Component, ViewChild } from '@angular/core';
import { OfficialHolidayFormComponent } from '../../../Components/official-holiday-form/official-holiday-form';
import { OfficialHolidayTableComponent } from '../../../Components/official-holiday-table/official-holiday-table';
import { IOfficialHoliday } from '../../../Interfaces/iofficial-holiday';


@Component({
  selector: 'app-official-holiday-combine',
  standalone: true,
  imports: [OfficialHolidayFormComponent, OfficialHolidayTableComponent],
  templateUrl: './official-holiday-combine.html',
  styleUrls: ['./official-holiday-combine.css']
})
export class OfficialHolidayCombineComponent {
  @ViewChild(OfficialHolidayTableComponent) table!: OfficialHolidayTableComponent;
  addedHoliday!: IOfficialHoliday;

  onAddHoliday(holiday: { name: string; date: string; }) {
    if (this.table) {
      // this.table.holidays.push(holiday);
    }
  }

  onHolidayAdded(holiday: IOfficialHoliday) {
    this.addedHoliday = holiday;
  }

} 