import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../Services/employee-service';
import { DepartmentService } from '../../../Services/department-service';
import { IDepartment } from '../../../Interfaces/idepartment';
import { Subscription } from 'rxjs';
import { IEmployee } from '../../../Interfaces/iemployee';
import { AuthService } from '../../../Services/auth-service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-employee-form',
  imports: [ReactiveFormsModule, CommonModule, NgxSpinnerModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css'
})
export class EmployeeForm implements OnInit, OnDestroy {
  employeeForm!: FormGroup;
  textType = false;
  selectedImageName = '';
  imagePreviewUrl: string | ArrayBuffer | null = null;

  genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  employee!: IEmployee;
  departmentOptions: IDepartment[] = [];
  subs: Subscription[] = [];
  editMode: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private employeeService: EmployeeService, 
    private departmentService: DepartmentService, 
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.loadDepartments();
    this.initForm();
    this.activatedRoute.params.subscribe(params => {
      if (params['id'] && params['id'] !== '0') {
        this.getEmployee(parseInt(params['id']));
        this.editMode = true;
      }
    });
  }

  initForm(): void {
    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      address: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+20[0125][0-9]{9}$/)]],
      gender: ['', Validators.required],
      nationalId: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
      departmentId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
        ]
      ],
      hireDate: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(0)]],
      image: [null]
    });
  }

  getEmployee(id: number): void {
    const sub = this.employeeService.getEmployeeById(id).subscribe({
      next: (resp) => {
        this.employee = resp;
        this.employeeForm.patchValue(this.employee);
        this.cdr.detectChanges();
      },
      complete: () => {
      }
    });
    this.subs.push(sub);
  }

  loadDepartments(): void {
    const sub = this.departmentService.getDepartments().subscribe({
      next: (resp) => {
        this.departmentOptions = resp;
      },
      error: (err) => {
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    });
    this.subs.push(sub);
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;
      const employeeData: IEmployee = { ...formValue };
      this.spinner.show();
      const formData = new FormData();
      Object.keys(employeeData).forEach(key => {
        if (key !== 'image' && employeeData[key as keyof IEmployee] !== undefined && employeeData[key as keyof IEmployee] !== null) {
          formData.append(key, employeeData[key as keyof IEmployee] as any);
        }
      });
      if (employeeData.image) {
        formData.append('image', employeeData.image);
      }      
      if (this.editMode) {
        formData.append('employeeId', this.employee.employeeId.toString());
        const sub = this.employeeService.editEmployee(formData, this.employee.employeeId).subscribe({
          next: (resp) => {
            Swal.fire({
              title: "Success!",
              text: "Employee Has Been Updated Successfully.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: (err) => {
            this.spinner.hide();
            if (err.error.message == "Duplicate phone number") {
              Swal.fire({
                title: "Error!",
                text: "Phone number already exists.",
                icon: "error"
              });
            }
            else if (err.error.message == "Duplicate National ID") {
              Swal.fire({
                title: "Error!",
                text: "National ID already exists.",
                icon: "error"
              });
            }
            else if (err.error[0].code == "DuplicateEmail") {
              Swal.fire({
                title: "Error!",
                text: "Email already exists.",
                icon: "error"
              });
            } 
            else{
                Swal.fire({
                title: "Error!",
                text: "Failed to update employee. Please try again.",
                icon: "error"
              });
            }

            },
          complete: () => {
            this.spinner.hide();
          }
        });
        this.subs.push(sub);
      } 
      else {
        const sub = this.employeeService.addEmployee(formData).subscribe({
          next: (resp) => {
            Swal.fire({
              title: "Success!",
              text: "Employee Has Been Added Successfully.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: (err) => {
            this.spinner.hide();
            if (err.error[1].code == "DuplicateEmail" || err.error[0].code == "DuplicateUserName") {
              Swal.fire({
                title: "Error!",
                text: "Email already exists.",
                icon: "error"
              });
            } 
            else  if (err.error.message == "Duplicate phone number") {
              Swal.fire({
                title: "Error!",
                text: "Phone number already exists.",
                icon: "error"
              });
            }
            else if (err.error.message == "Duplicate National ID") {
              Swal.fire({
                title: "Error!",
                text: "National ID already exists.",
                icon: "error"
              });
            }
            else {
              Swal.fire({
                title: "Error!",
                text: "Failed to add employee. Please try again.",
                icon: "error"
              });
            }
          },
          complete: () => {
            this.resetForm();
            this.spinner.hide();
          }
        });
        this.subs.push(sub);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.employeeForm.controls).forEach(key => {
      const control = this.employeeForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.employeeForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldLabel(fieldName)} must not exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
      if (field.errors['pattern']) {
        return this.getPatternErrorMessage(fieldName);
      }
      if (fieldName === 'email' && field.errors['email']) {
        return this.getPatternErrorMessage(fieldName);
      }
      if (field.errors['min']) {
        return `${this.getFieldLabel(fieldName)} must be greater than 0`;
      }
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Employee Name',
      address: 'Address',
      phoneNumber: 'Phone Number',
      gender: 'Gender',
      idNumber: 'ID Number',
      joinDate: 'Join Date',
      salary: 'Salary',
      departmentId: 'Department',
      email: 'Email',
      password: 'Password',
    };
    return labels[fieldName] || fieldName;
  }

  getPatternErrorMessage(fieldName: string): string {
    const messages: { [key: string]: string } = {
      phoneNumber: 'Please enter a valid phone number starting with +20, followed by 0, 1, 2, or 5, then 9 digits.',
      nationalId: 'ID Number must be exactly 14 digits',
      email: 'Please enter a valid email address',
      password: 'Password must be at least 8 characters and contain both uppercase and lowercase letters.',
    };
    return messages[fieldName] || 'Invalid format';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.employeeForm.get('image')?.setValue(file);
      this.selectedImageName = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviewUrl = (e.target?.result ?? null) as string | ArrayBuffer | null;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    } else {
      this.imagePreviewUrl = null;
      this.selectedImageName = '';
      this.employeeForm.get('image')?.setValue(null);
    }
  }

  resetForm(): void {
    this.employeeForm.reset();
    this.employeeForm.patchValue({
      gender: '',
      departmentId: '',
    });
    this.imagePreviewUrl = null;
    this.selectedImageName = '';
  }

  toggleTextType(): void {
    this.textType = !this.textType;
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
