import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-User',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class User {
  registerForm: FormGroup;
  @ViewChild('customInput') inputElement!: ElementRef<HTMLInputElement>;
  isManualMode:boolean = false;
  public countries: string[] = ['India', 'US', 'England', 'Add New Custom Option...'];

constructor(private fb: FormBuilder)
{
this.registerForm = fb.group({
  firstName: ["", Validators.required],
  lastName: ["", Validators.required],
  email: ["", [Validators.required, Validators.email]],
  mobileNo: ["", [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
  salary : [""],
  photo : [null],
  cv : [null]
})
}

onSubmit()
{
  if(this.registerForm.valid)
  {
    const formData = this.registerForm.getRawValue();
    const jsonString = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });

    const cvFileData: File = this.registerForm.get('cv')?.value;
    const photoFileData: File = this.registerForm.get('photo')?.value;

    const cvBlob = new Blob([cvFileData], { type: cvFileData.type });
    const photBlob = new Blob([photoFileData], { type: photoFileData.type });
  
  // Prompt the browser to save it
  saveAs(cvBlob, cvFileData.name);
  saveAs(photBlob, photoFileData.name);

  saveAs(blob, 'data-export.json');
    
    console.log(this.registerForm.value)
  }
}

addManualEntry()
{
  this.countries = this.countries.filter(c => c !== 'Add New Custom Option...');
  const addedCountry = this.inputElement.nativeElement.value;
  this.countries.push(addedCountry);
  this.countries.push('Add New Custom Option...');
  this.isManualMode = false;

}

cancelManualEntry()
{
  this.isManualMode = false;
}

onValueChange(event: Event): void {
    const element = event.target as HTMLSelectElement;
    const selectedValue = element.value;
    if(selectedValue == 'Add New Custom Option...')
      {
        this.isManualMode = true;
      };
    console.log('Selected value:', selectedValue);
  }

  oncvFileChange(event: Event): void {
    const element = event.target as HTMLInputElement;
    const files = element.files;

    if (files && files.length > 0) {
      const file = files[0];
      
      // Patch the raw File object directly into the form control
      this.registerForm.patchValue({
        cv: file
      });
    }
  }

  onphotoFileChange(event: Event): void {
    const element = event.target as HTMLInputElement;
    const files = element.files;

    if (files && files.length > 0) {
      const file = files[0];
      
      // Patch the raw File object directly into the form control
      this.registerForm.patchValue({
        photo: file
      });
    }
  }


}
