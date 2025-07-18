import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { trigger, style, animate, transition, query, group } from '@angular/animations';
import { IEmployee } from '../../../Interfaces/iemployee';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../../../Services/employee-service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

interface BoardMember {
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [FormsModule, CommonModule, SweetAlert2Module],
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
export class EmployeesComponent implements OnInit, OnDestroy {

  constructor(private employeeService: EmployeeService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadEmployees();
  }



  boardMembers: BoardMember[] = [
    { name: 'Grace Hall', email: 'name@talenthub.com', role: 'General Director', avatarUrl: '' },
    { name: 'Bob Brown', email: 'name@talenthub.com', role: 'The CEO', avatarUrl: '' },
    { name: 'John Doe', email: 'name@talenthub.com', role: 'The CTO', avatarUrl: '' },
    { name: 'Alice Johnson', email: 'name@talenthub.com', role: 'The CMO', avatarUrl: '' },
  ];

  employees: IEmployee[] = [];
  subs: Subscription[] = [];

  // Placeholder for search/filter
  searchTerm = '';
  jobType = 'All';
  level = 'All';

  selectedGroup = 'All';
  get departments(): string[] {
    const allDepartments = this.employees.map(e => e.departmentName);
    return ['All', ...Array.from(new Set(allDepartments))];
  }

  // get jobTypes(): string[] {
  //   const all = this.employees.map(e => e.jobType);
  //   return ['All', ...Array.from(new Set(all))];
  // }
  // get levels(): string[] {
  //   const all = this.employees.map(e => e.level);
  //   return ['All', ...Array.from(new Set(all))];
  // }

  expandedGroups = new Set<string>([]); // By default, 'All' is expanded

  get groupedEmployees(): { [group: string]: IEmployee[] } {
    const groups: { [group: string]: IEmployee[] } = {};
    for (const emp of this.getEmployeesByGroup()) {
      if (!groups[emp.departmentName]) groups[emp.departmentName] = [];
      groups[emp.departmentName].push(emp);
    }
    return groups;
  }

  loadEmployees() {
    this.subs.push(this.employeeService.getEmployees().subscribe({
      next: (resp) => {
        this.employees = resp;
        this.cdr.detectChanges();
        console.log(this.employees);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        
      }
    }));
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

  editEmployee(employee: IEmployee) {
    // Placeholder for edit action
    alert('Edit ' + employee.fullName);
  }

  deleteEmployee(empId: number) {
    console.log(empId);
    this.subs.push(this.employeeService.deleteEmployee(empId).subscribe({
      next: (resp) => {
        Swal.fire("Success", "Deleted Successfully", "success");
        this.employees = this.employees.filter(e => e.employeeId !== empId);
        this.cdr.detectChanges();
      },
      error: (err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        console.log(err);
      },
      complete: () => {
      }
    }));
  }

  getEmployeesByGroup(): IEmployee[] {
    const selected = this.selectedGroup.trim().toLowerCase();
    return this.employees.filter(e => {
      const group = e.departmentName.trim().toLowerCase();
      const matchesGroup = selected === 'all' || group === selected;
      const term = this.searchTerm.trim().toLowerCase();
      const matchesSearch = !term ||
        e.fullName.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term);
      return matchesGroup && matchesSearch;
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}

export { EmployeesComponent as Employees }; 