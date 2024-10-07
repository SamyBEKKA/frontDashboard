import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { AuthService } from '../shared/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../shared/auth';

@Component({
  selector: 'app-confirmation-commande',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './confirmation-commande.component.html',
  styleUrl: './confirmation-commande.component.css'
})
export class ConfirmationCommandeComponent implements OnInit {
  user: User | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Récupérer les informations utilisateur à partir du token
    const tokenUser = this.authService.getCurrentUser();

    if (tokenUser && tokenUser.user_email) {
      console.log('Utilisateur récupéré à partir du token :', tokenUser);

      // Utiliser l'email pour récupérer les détails complets de l'utilisateur depuis l'API
      this.authService.getUserByEmail(tokenUser.user_email).subscribe(
        (userData: User) => {
          this.user = userData;  // Stocker les données utilisateur complètes
        },
        (error) => {
          console.error('Erreur lors de la récupération des données utilisateur :', error);
        }
      );
    } else {
      console.error('Aucun utilisateur connecté ou email manquant dans le token');
    }
  }

  continue(): void {
    this.router.navigate(['/paiement']);
  }

  
}
