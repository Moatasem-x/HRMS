import { Component, ViewChild } from '@angular/core';
import { OfficialHolidayForm } from '../../../Components/official-holiday-form/official-holiday-form';
import { OfficialHolidayTable } from '../../../Components/official-holiday-table/official-holiday-table';
import { IOfficialHoliday } from '../../../Interfaces/iofficial-holiday';


@Component({
  selector: 'app-official-holiday-combine',
  standalone: true,
  imports: [OfficialHolidayForm, OfficialHolidayTable],
  templateUrl: './official-holiday-combine.html',
  styleUrls: ['./official-holiday-combine.css']
})
export class OfficialHolidayCombine {
  @ViewChild(OfficialHolidayTable) table!: OfficialHolidayTable;
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