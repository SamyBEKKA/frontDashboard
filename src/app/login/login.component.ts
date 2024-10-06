import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { catchError, of, pipe, tap } from 'rxjs';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  registerForm: FormGroup; // Formulaire d'inscription
  loginForm: FormGroup; // Formulaire de connexion
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Initialisation du formulaire d'inscription
    this.registerForm = this.fb.group({
      user_name: ['', Validators.required],
      user_last_name: ['', Validators.required],
      user_genre: ['', Validators.required],
      user_birthday: ['', Validators.required],
      user_email: ['', [Validators.required, Validators.email]],
      user_tel: ['', Validators.required],
      user_adress: ['', Validators.required],
      password: ['', [Validators.required, this.passwordValidator()]],
      confirm_password: ['', [Validators.required, this.passwordValidator()]],
      // city_id: ['', Validators.optional] // Si nécessaire
    }, { validator: this.passwordMatchValidator });

    // Initialisation du formulaire de connexion
    this.loginForm = this.fb.group({
      credentials: this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
      }),
    });
  }

  ngOnInit() {}

  onRegisterSubmit() {
    if (this.registerForm.valid) {
      const userData = {
        user_name: this.registerForm.value.user_name,
        user_last_name: this.registerForm.value.user_last_name,
        user_genre: this.registerForm.value.user_genre,
        user_birthday: this.registerForm.value.user_birthday,
        user_email: this.registerForm.value.user_email,
        user_tel: this.registerForm.value.user_tel,
        user_adress: this.registerForm.value.user_adress,
        password: this.registerForm.value.password, // Hachage côté serveur
        confirm_password: this.registerForm.value.confirm_password,
        user_roles: ['ROLE_USER'], // Rôle par défaut
      }; // Ajoute le validateur
      console.log(userData);
      this.authService.createUser(userData)
      .pipe(
          tap(response => {
            console.log('Utilisateur créé avec succès', response);
            // Logique de redirection ou message de succès
            // Récupérer l'URL de redirection du localStorage (si elle existe)
            const redirectUrl = localStorage.getItem('redirectUrl') || '';
            localStorage.removeItem('redirectUrl'); // Nettoyer après redirection
            // Rediriger l'utilisateur vers la page appropriée
            this.router.navigate([redirectUrl]);
          }),
          catchError(error => {
            console.error('Erreur lors de la création de l’utilisateur', error);
            return of(null); // ou une valeur par défaut
          })
      )
      .subscribe();
    } else {
      console.log('Formulaire d’inscription invalide');
    }
  }

  // Validateur personnalisé pour les exigences du mot de passe
  passwordValidator() {
    return (control: any): { [key: string]: any } | null => {
      const password = control.value;
      
      if (!password) {
        return { passwordInvalid: 'Le mot de passe est requis de manière spécifique pour des raisons de sécurité.' };
      }

     // Vérification combinée des majuscules, minuscules, chiffres et symboles
      if (
        !/[A-Z]/.test(password) || 
        !/[a-z]/.test(password) || 
        !/\d/.test(password) || 
        !/[!@#$%^&*(),.?':{}|<>_-]/.test(password)) {
      return { passwordInvalid: "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et l'un de ces caractères spéciaux : !@#$%^&*(),.?':{}|<>_-"
        }
      }


      return null; // Le mot de passe est valide
    };
  }

  passwordMatchValidator(formGroup: FormGroup) {
    return formGroup.get('password')?.value === formGroup.get('confirm_password')?.value
      ? null : { mismatch: true };
  }
  
  // Soumission du formulaire de connexion
  onLoginSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value.credentials;
      this.authService.login({ username, password }).subscribe(
        response => {
          console.log('Token reçu:', response.token);
          this.authService.saveToken(response.token); // Sauvegarde le token
          // console.log(this.authService.getToken())
          // Récupérer l'URL de redirection du localStorage (si elle existe)
          const redirectUrl = localStorage.getItem('redirectUrl') || '';
          localStorage.removeItem('redirectUrl'); // Nettoyer après redirection
          // Rediriger l'utilisateur vers la page appropriée
          this.router.navigate([redirectUrl]);
        },
        error => {
          console.error('Échec de la connexion', error);
          this.errorMessage = 'Identifiants invalides, veuillez réessayer.';
        }
      );
    } else {
      console.log('Formulaire de connexion invalide');
    }
  }
}
