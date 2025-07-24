import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DepartmentService } from '../../../Services/department-service';
import { EmployeeService } from '../../../Services/employee-service';
import { TasksService } from '../../../Services/tasks-service';
import { IDepartment } from '../../../Interfaces/idepartment';
import { IEmployee } from '../../../Interfaces/iemployee';
import { ITask } from '../../../Interfaces/itask';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class Tasks implements OnInit, OnDestroy {
  tasks: any[] = [];
  departments: IDepartment[] = [];
  employees: IEmployee[] = [];
  filteredEmployees: IEmployee[] = [];
  showAddForm = false;
  error: string | null = null;
  taskForm!: FormGroup;
  subs: Subscription[] = [];

  constructor(
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private tasksService: TasksService,
    private fb: FormBuilder,
    private cdr:ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadDepartments();
    this.loadTasks();
  }

  initForm() {
    this.taskForm = this.fb.group({
      departmentId: [null, Validators.required],
      employeeId: [null, Validators.required],
      description: ['', [Validators.required, Validators.minLength(5)]],
      dueDate: ['', Validators.required]
    });
  }

  get departmentId() { return this.taskForm.get('departmentId'); }
  get employeeId() { return this.taskForm.get('employeeId'); }
  get description() { return this.taskForm.get('description'); }
  get dueDate() { return this.taskForm.get('dueDate'); }

  loadDepartments() {
    this.subs.push(this.departmentService.getDepartments().subscribe({
      next: (departments: IDepartment[]) => {
        this.departments = departments;
        console.log("load",departments);
      }
    }));
  }

  loadEmployees() {
    this.subs.push(this.employeeService.getEmployees().subscribe({
      next: (resp) => {
        this.employees = resp;
        this.cdr.detectChanges();
      }
    }));
  }

  onDepartmentChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const deptId = target.value;
    if (!deptId) return;
    const id = Number(deptId);
    console.log("DeptID",deptId)
    this.filteredEmployees = this.employees.filter(e => e.departmentId == id);
    this.taskForm.patchValue({ employeeId: null });
    console.log(this.filteredEmployees);
  }

  loadTasks() {
    this.subs.push(this.tasksService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load tasks.';
      }
    }));
  }

  showAddTaskForm() {
    this.showAddForm = true;
    this.taskForm.reset();
    this.error = null;
    if (!this.employees.length) this.loadEmployees();
  }

  hideAddTaskForm() {
    this.showAddForm = false;
    this.taskForm.reset();
    this.error = null;
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    const newTask:ITask = {
      employeeId: this.taskForm.value.employeeId,
      description: this.taskForm.value.description,
      dueDate: this.taskForm.value.dueDate
    };
    this.subs.push(this.tasksService.addTask(newTask).subscribe({
      next: (task: any) => {
        this.tasks.push(task);
        this.hideAddTaskForm();
        console.log("Task",task);
        console.log("All Tasks",this.tasks);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Failed to add task.';
      }
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
} 