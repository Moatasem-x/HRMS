import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DepartmentService } from '../../../Services/department-service';
import { EmployeeService } from '../../../Services/employee-service';
import { IDepartment } from '../../../Interfaces/idepartment';
import { IEmployee } from '../../../Interfaces/iemployee';
import { TasksService } from '../../../Services/tasks-service';
import { ITask } from '../../../Interfaces/itask';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxSpinnerModule],
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
    private cdr:ChangeDetectorRef,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();
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
      },
      error: () => {
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
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
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
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
    this.spinner.show();
    const newTask:ITask = {
      employeeId: this.taskForm.value.employeeId,
      description: this.taskForm.value.description,
      dueDate: this.taskForm.value.dueDate
    };
    this.subs.push(this.tasksService.addTask(newTask).subscribe({
      next: (task: any) => {
        this.tasks.push(task);
        this.hideAddTaskForm();
        this.cdr.detectChanges();
        Swal.fire({
          title: "Success!",
          text: "Task added successfully",
          icon: "success"
        });
      },
      error: (err) => {
        this.spinner.hide();
        Swal.fire({
          title: "Error!",
          text: "Failed to add task. Please try again.",
          icon: "error"
        });
      },
      complete: () => {
        this.spinner.hide();
      }
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
} 