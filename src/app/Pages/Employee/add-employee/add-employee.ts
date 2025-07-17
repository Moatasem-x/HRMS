import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Employee {
  name: string;
  address: string;
  phoneNumber: string;
  gender: string;
  nationality: string;
  birthDate: Date;
  idNumber: string;
  joinDate: Date;
  salary: number;
  attendanceTime: string;
  dismissTime: string;
}

@Component({
  selector: 'app-add-employee',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-employee.html',
  styleUrl: './add-employee.css'
})
export class AddEmployee implements OnInit {
  employeeForm!: FormGroup;
  isSubmitting = false;
  submitSuccess = false;

  genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  nationalityOptions = [
    { value: 'egyptian', label: 'Egyptian' },
    { value: 'american', label: 'American' },
    { value: 'british', label: 'British' },
    { value: 'canadian', label: 'Canadian' },
    { value: 'australian', label: 'Australian' },
    { value: 'german', label: 'German' },
    { value: 'french', label: 'French' },
    { value: 'other', label: 'Other' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      address: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[\+]?[1][\d]{0,15}$/)]],
      gender: ['', Validators.required],
      nationality: ['', Validators.required],
      birthDate: ['', Validators.required],
      idNumber: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
      joinDate: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(0)]],
      attendanceTime: ['', Validators.required],
      dismissTime: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      // Get form values BEFORE resetting
      const employeeData: Employee = this.employeeForm.value;
      
      console.log('Form is valid:', this.employeeForm.valid);
      console.log('Form values:', employeeData);
      console.log('Raw form object:', this.employeeForm);
      
      this.isSubmitting = true;
      
      // Simulate API call
      setTimeout(() => {
        console.log('Submitting employee data:', employeeData);
        
        // Here you would typically make an API call to save the employee
        // this.employeeService.addEmployee(employeeData).subscribe(...)
        
        this.isSubmitting = false;
        this.submitSuccess = true;
        
        // Reset form AFTER getting the values
        this.employeeForm.reset();
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          this.submitSuccess = false;
        }, 3000);
      }, 1000);
    } else {
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
      nationality: 'Nationality',
      birthDate: 'Birth Date',
      idNumber: 'ID Number',
      joinDate: 'Join Date',
      salary: 'Salary',
      attendanceTime: 'Attendance Time',
      dismissTime: 'Dismiss Time',
    };
    return labels[fieldName] || fieldName;
  }

  getPatternErrorMessage(fieldName: string): string {
    const messages: { [key: string]: string } = {
      phoneNumber: 'Please enter a valid phone number (e.g., +1234567890)',
      idNumber: 'ID Number must be exactly 14 digits',
    };
    return messages[fieldName] || 'Invalid format';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  resetForm(): void {
    this.employeeForm.reset();
    this.submitSuccess = false;
  }
}
