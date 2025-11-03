import { Component, ChangeDetectorRef } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-contact',
  imports: [NgIf],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  
  isSubmitting = false;
  statusMessage = '';
  statusType = '';

  constructor(private cdr: ChangeDetectorRef) {}

  async onSubmit(event: Event) {
    event.preventDefault();
    
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.statusMessage = '';
    this.statusType = '';
    
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      console.log('Submitting form...');
      const response = await fetch('https://formspree.io/f/mdkpjlwq', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      let responseData;
      try {
        responseData = await response.json();
        console.log('Response data:', responseData);
      } catch (jsonError) {
        console.error('Failed to parse JSON:', jsonError);
        throw new Error('Invalid response format');
      }
      
      if (response.ok) {
        // Formspree success response - check for either ok:true or just successful HTTP status
        this.statusType = 'success';
        this.statusMessage = 'Thanks for your submission! I\'ll get back to you within 24-48 hours.';
        form.reset();
        console.log('Form submitted successfully');
      } else {
        // Handle errors
        this.statusType = 'error';
        if (responseData.errors && Array.isArray(responseData.errors)) {
          this.statusMessage = responseData.errors.map((error: any) => error.message).join(', ');
        } else if (responseData.error) {
          this.statusMessage = responseData.error;
        } else {
          this.statusMessage = 'Oops! There was a problem submitting your form. Please try again.';
        }
        console.log('Form submission failed:', this.statusMessage);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.statusType = 'error';
      this.statusMessage = 'Oops! There was a problem submitting your form. Please email me directly at trisshasantos@gmail.com';
    } finally {
      console.log('Setting isSubmitting to false');
      this.isSubmitting = false;
      // Manually trigger change detection
      this.cdr.detectChanges();
    }
  }
}
