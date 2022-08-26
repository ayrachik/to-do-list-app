import { Router } from '@angular/router';
import { AuthService } from './../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  get username(): FormControl { return this.loginForm.get('username') as FormControl; }
  get password(): FormControl { return this.loginForm.get('password') as FormControl; }

  ngOnInit() {
    this.initForm();
  }

  public submit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.authService.login(this.username.value, this.password.value).subscribe(
      _ => this.router.navigate(['/home']),
      _ => this.loginForm.reset()
    );
  }

  private initForm(): void {
    this.loginForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
      }
    );
  }

}
