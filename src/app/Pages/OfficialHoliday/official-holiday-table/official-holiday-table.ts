import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface OfficialHoliday {
  name: string;
  date: string;
}

@Component({
  selector: 'app-official-holiday-table',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './official-holiday-table.html',
  styleUrls: ['./official-holiday-table.css']
})
export class OfficialHolidayTableComponent {
  holidays: OfficialHoliday[] = [
    { name: 'نصر 6 اكتوبر', date: ' 10/7/2021' },
    { name: 'المولد النبوى', date: ' 10/21/2021' }
  ];

  editIndex: number | null = null;
  editedHoliday: OfficialHoliday | null = null;

  editHoliday(index: number) {
    this.editIndex = index;
    this.editedHoliday = { ...this.holidays[index] };
  }

  saveHoliday(index: number) {
    if (this.editedHoliday) {
      this.holidays[index] = { ...this.editedHoliday };
      this.editIndex = null;
      this.editedHoliday = null;
    }
  }

  deleteHoliday(index: number) {
    this.holidays.splice(index, 1);
    if (this.editIndex === index) {
      this.editIndex = null;
      this.editedHoliday = null;
    }
  }
} 