import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../Services/employee-service';
import { DepartmentService } from '../../../Services/department-service';
import { IDepartment } from '../../../Interfaces/idepartment';
import { Subscription } from 'rxjs';
import { IEmployee } from '../../../Interfaces/iemployee';
import { AuthService } from '../../../Services/auth-service';


@Component({
  selector: 'app-employee-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css'
})
export class EmployeeForm implements OnInit, OnDestroy {
  employeeForm!: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  textType = false;

  genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  departmentOptions: IDepartment[] = [];
  subs: Subscription[] = [];

  constructor(
    private fb: FormBuilder, 
    private employeeService: EmployeeService, 
    private departmentService: DepartmentService, 
    private cdr: ChangeDetectorRef,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.initForm();
    console.log(this.authService.getEmail());
    console.log(this.authService.getRole());
    console.log(this.authService.getUserName());
    
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

  loadDepartments(): void {
    const sub = this.departmentService.getDepartments().subscribe({
      next: (resp) => {
        this.departmentOptions = resp;
      },
      error: (err) => {
        console.error('Error loading departments:', err);
      }
    });
    this.subs.push(sub);
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;
      const employeeData: IEmployee = { ...formValue };
      const formData = new FormData();

      // Append all fields except image
      Object.keys(employeeData).forEach(key => {
        if (key !== 'image' && employeeData[key as keyof IEmployee] !== undefined && employeeData[key as keyof IEmployee] !== null) {
          formData.append(key, employeeData[key as keyof IEmployee] as any);
        }
      });

      // Append the image file if present
      if (employeeData.image) {
        formData.append('image', employeeData.image);
      }
      console.log(formData);

      this.isSubmitting = true;
      const sub = this.employeeService.addEmployee(formData).subscribe({
        next: (resp) => {
          console.log('Employee added successfully:', resp);
        },
        error: (err) => {
          console.error('Error adding employee:', err);
        },
        complete: () => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.resetForm();
          setTimeout(() => {
            this.submitSuccess = false;
          }, 2000);
        }
      });
      this.subs.push(sub);
    } 
    else {
      console.log('Form is invalid:', this.employeeForm.errors);
      console.log('Form values when invalid:', this.employeeForm.value);
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

  resetForm(): void {
    this.employeeForm.reset();
    this.employeeForm.patchValue({
      gender: '',
      departmentId: '',
    });
    this.submitSuccess = false;
  }

  toggleTextType(): void {
    this.textType = !this.textType;
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
