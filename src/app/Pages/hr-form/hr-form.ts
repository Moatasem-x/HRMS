import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IDepartment } from '../../Interfaces/idepartment';
import { IEmployee } from '../../Interfaces/iemployee';
import { DepartmentService } from '../../Services/department-service';
import { EmployeeService } from '../../Services/employee-service';
import { AuthService } from '../../Services/auth-service';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HRService } from '../../Services/hr-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hr-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './hr-form.html',
  styleUrl: './hr-form.css'
})
export class HRForm implements OnInit, OnDestroy {
  hrForm!: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  textType = false;
  selectedImageName = '';
  imagePreviewUrl: string | ArrayBuffer | null = null;

  genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  departmentOptions: IDepartment[] = [];
  subs: Subscription[] = [];

  constructor(
    private fb: FormBuilder, 
    private HRService: HRService,
    private departmentService: DepartmentService, 
    private cdr: ChangeDetectorRef,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.initForm();
    
  }

  initForm(): void {
    this.hrForm = this.fb.group({
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
      image: [null, Validators.required]
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
    if (this.hrForm.valid) {
      const formValue = this.hrForm.value;
      const hrData: IEmployee = { ...formValue };
      const formData = new FormData();

      // Append all fields except image
      Object.keys(hrData).forEach(key => {
        if (key !== 'image' && hrData[key as keyof IEmployee] !== undefined && hrData[key as keyof IEmployee] !== null) {
          formData.append(key, hrData[key as keyof IEmployee] as any);
        }
      });

      // Append the image file if present
      if (hrData.image) {
        formData.append('image', hrData.image);
      }
      console.log(formData);

      this.isSubmitting = true;
      const sub = this.HRService.addHR(formData).subscribe({
        next: (resp) => {
          Swal.fire({
            title: "Success!",
            text: "HR Has Been Added Successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
          });
        },
        error: (err) => {
          console.error('Error adding HR:', err);
        },
        complete: () => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.resetForm();
        }
      });
      this.subs.push(sub);
    } 
    else {
      console.log('Form is invalid:', this.hrForm.errors);
      console.log('Form values when invalid:', this.hrForm.value);
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.hrForm.controls).forEach(key => {
      const control = this.hrForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.hrForm.get(fieldName);
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
      name: 'HR Name',
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
    const field = this.hrForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.hrForm.get('image')?.setValue(file);
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
      this.hrForm.get('image')?.setValue(null);
    }
  }

  resetForm(): void {
    this.hrForm.reset();
    this.hrForm.patchValue({
      gender: '',
      departmentId: '',
    });
    this.submitSuccess = false;
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
