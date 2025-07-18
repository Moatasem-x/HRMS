import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { trigger, style, animate, transition, query, group } from '@angular/animations';


interface BoardMember {
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  phone: string;
  joinDate: string;
  group: string;
  level: string;
  jobType: string;
  experience: string;
}

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './employees.html',
  styleUrls: ['./employees.css'],
  animations: [
    trigger("expand",[
      transition(":enter", [
        style({height: 0,opacity: 0}),
        query(".details",[
          style({translate: "0 -100%"})
        ]),
        group([
          animate("0.8s cubic-bezier(0.4, 0, 0.2, 1)", style({height: "*", opacity: 1})),
          query(".details",[
            animate("0.8s cubic-bezier(0.4, 0, 0.2, 1)", style({translate: "0 0"}))
          ])
        ])
      ]),
      transition(":leave",[
        style({height: "*", opacity: 1}),
        query(".details",[
          style({translate: "0 0"})
        ]),
        group([
          animate("0.8s cubic-bezier(0.4, 0, 0.2, 1)", style({height: 0,opacity: 0})),
          query(".details",[
            animate("0.8s cubic-bezier(0.4, 0, 0.2, 1)", style({translate: "0 -100%"}))
          ])
        ])
      ])
    ])
  ]
})
export class EmployeesComponent {
  boardMembers: BoardMember[] = [
    { name: 'Grace Hall', email: 'name@talenthub.com', role: 'General Director', avatarUrl: '' },
    { name: 'Bob Brown', email: 'name@talenthub.com', role: 'The CEO', avatarUrl: '' },
    { name: 'John Doe', email: 'name@talenthub.com', role: 'The CTO', avatarUrl: '' },
    { name: 'Alice Johnson', email: 'name@talenthub.com', role: 'The CMO', avatarUrl: '' },
  ];

  employees: Employee[] = [
    { id: 'E00173', name: 'Bob Brown', role: 'Lead Designer', phone: '555-456-7890', joinDate: '20-05-2024', group: 'UI/UX designer', level: 'Manager', jobType: 'Full Time', experience: 'Senior' },
    { id: 'E00172', name: 'Charlie Davis', role: 'Sub-Lead Designer', phone: '555-567-4891', joinDate: '20-05-2024', group: 'UI/UX designer', level: 'Manager', jobType: 'Part Time', experience: 'Junior' },
    { id: 'E00174', name: 'Emily Evans', role: 'Junior Designer', phone: '555-567-4891', joinDate: '20-05-2024', group: 'UI/UX designer', level: 'Manager', jobType: 'Full Time', experience: 'Junior' },
    { id: 'E00201', name: 'Ahmed Ali', role: 'Frontend Engineer', phone: '555-123-4567', joinDate: '21-05-2024', group: 'Engineering', level: 'Senior', jobType: 'Full Time', experience: 'Senior' },
    { id: 'E00202', name: 'Sara Smith', role: 'Backend Engineer', phone: '555-234-5678', joinDate: '22-05-2024', group: 'Engineering', level: 'Junior', jobType: 'Part Time', experience: 'Junior' },
    { id: 'E00301', name: 'Lina Lee', role: 'Graphic Designer', phone: '555-345-6789', joinDate: '23-05-2024', group: 'Design', level: 'Mid', jobType: 'Full Time', experience: 'Mid' },
    { id: 'E00302', name: 'Tom Green', role: 'Illustrator', phone: '555-456-7891', joinDate: '24-05-2024', group: 'Design', level: 'Senior', jobType: 'Part Time', experience: 'Senior' },
    { id: 'E00401', name: 'Mona Hassan', role: 'HR Manager', phone: '555-789-1234', joinDate: '25-05-2024', group: 'HR', level: 'Senior', jobType: 'Full Time', experience: 'Senior' },
    { id: 'E00402', name: 'Omar Youssef', role: 'Recruiter', phone: '555-890-2345', joinDate: '26-05-2024', group: 'HR', level: 'Junior', jobType: 'Part Time', experience: 'Junior' },
    // Add more mock data for other groups as needed
  ];

  // Placeholder for search/filter
  searchTerm = '';
  jobType = 'All';
  level = 'All';

  selectedGroup = 'All';
  get groups(): string[] {
    const allGroups = this.employees.map(e => e.group);
    return ['All', ...Array.from(new Set(allGroups))];
  }

  get jobTypes(): string[] {
    const all = this.employees.map(e => e.jobType);
    return ['All', ...Array.from(new Set(all))];
  }
  get levels(): string[] {
    const all = this.employees.map(e => e.level);
    return ['All', ...Array.from(new Set(all))];
  }

  expandedGroups = new Set<string>(['All']); // By default, 'All' is expanded

  get groupedEmployees(): { [group: string]: Employee[] } {
    const groups: { [group: string]: Employee[] } = {};
    for (const emp of this.getEmployeesByGroup()) {
      if (!groups[emp.group]) groups[emp.group] = [];
      groups[emp.group].push(emp);
    }
    return groups;
  }

  isGroupExpanded(group: string): boolean {
    return this.expandedGroups.has(group);
  }

  toggleGroup(group: string): void {
    if (this.expandedGroups.has(group)) {
      this.expandedGroups.delete(group);
    } else {
      this.expandedGroups.add(group);
    }
  }

  editEmployee(employee: Employee) {
    // Placeholder for edit action
    alert('Edit ' + employee.name);
  }

  deleteEmployee(employee: Employee) {
    // Placeholder for delete action
    alert('Delete ' + employee.name);
  }

  getEmployeesByGroup(): Employee[] {
    const selected = this.selectedGroup.trim().toLowerCase();
    return this.employees.filter(e => {
      const group = e.group.trim().toLowerCase();
      const matchesGroup = selected === 'all' || group === selected;
      const term = this.searchTerm.trim().toLowerCase();
      const matchesSearch = !term ||
        e.name.toLowerCase().includes(term) ||
        e.role.toLowerCase().includes(term);
      const matchesJobType = this.jobType === 'All' || e.jobType === this.jobType;
      const matchesLevel = this.level === 'All' || e.level === this.level;
      return matchesGroup && matchesSearch && matchesJobType && matchesLevel;
    });
  }
}

export { EmployeesComponent as Employees }; 