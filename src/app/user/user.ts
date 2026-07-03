import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, viewChild, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { numericValidator } from '../validator';

@Component({
  selector: 'app-User',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class User implements  OnDestroy {
  registerForm: FormGroup;
  userformSubscription!:Subscription;
  @ViewChild('customInput') inputElement!: ElementRef<HTMLInputElement>;
  @ViewChild('customSkillInput') inputSkillElement!: ElementRef<HTMLInputElement>;
  isManualMode:boolean = false;
  isManualSkillMode:boolean = false;
  isSelectSkill:boolean = false;
  userService = inject(UserService);
  public countries: string[] = ['India', 'US', 'England', 'Add New Custom Option...'];
  public skills: string[] = ['Angular', '.NET', 'Azure'];
  public selectedSkills: string[] = [];
  public selectedSkillsText: string = "";

constructor(private fb: FormBuilder,private toasterService:ToastrService)
{
this.registerForm = fb.group({
  firstName: ["", Validators.required],
  lastName: ["", Validators.required],
  email: ["", [Validators.required, Validators.email]],
  mobileNo: ["", [Validators.required, Validators.maxLength(10), Validators.minLength(10), numericValidator]],
  salary : ["", numericValidator],
  photo : [null, [Validators.required]],
  cv : [null, [Validators.required]],
  password: ["", Validators.required],
  skill: [null]
})
}

ngOnDestroy(): void {
    if(this.userformSubscription){
      this.userformSubscription.unsubscribe();
    }
    
  }

onSubmit()
{
  if(this.registerForm.valid)
  {

  this.userformSubscription= this.userService.addUser(this.registerForm.value).subscribe({
      next:(response)=>{
        console.log(response);
        this.toasterService.success("User sucesfully added")
        //this.router.navigateByUrl('/students');
        
      },
      error:err=>{
        console.log(err);
        
      }
    })
    
    console.log(this.registerForm.value)
  }
}

SelectSkill(event: MouseEvent): void {
    this.isSelectSkill = true;
    console.log('Raw pointer event:', event);
  }

ShowManualSkill(): void {
    this.isManualSkillMode = true;
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

addManualSkillEntry()
{
  const addedSkill = this.inputSkillElement.nativeElement.value;
  this.skills.push(addedSkill);
  this.isManualSkillMode = false;

}

cancelManualSkillEntry()
{
  this.isManualSkillMode = false;
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

  onCheckboxChange(item: string, event: Event): void {
    // Cast target to HTMLInputElement to prevent TypeScript errors
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      // Add the item text if checked
      this.selectedSkills.push(item);
    } else {
      // Remove the item text if unchecked
      this.selectedSkills = this.selectedSkills.filter(val => val !== item);
  }
if (this.selectedSkills?.length) {
     this.selectedSkillsText = this.selectedSkills.join(',');
  
  }
this.registerForm.patchValue({
    skill: this.selectedSkills
  });
}
}

