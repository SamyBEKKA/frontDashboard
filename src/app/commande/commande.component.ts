import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../shared/article.service';
import { PrestationService } from '../shared/prestation.service';
import { HeaderComponent } from "../header/header.component";
import { MaterialService } from '../shared/material.service';
import { Article, Material, Service } from '../shared/auth';

import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-commande',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HeaderComponent, FormsModule],
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css']
})
export class CommandeComponent implements OnInit {
  services: Service[] = [];
  articles: Article[] = [];
  materials: Material[] = [];

  selectedArticle: string = '';
  selectedMaterial: string = '';
  selectedService: any = null;

  savedOrders: any[] = [];

  constructor(
    private prestationService: PrestationService,
    private articleService: ArticleService,
    private materialService: MaterialService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getServices();
    this.getArticles();
    this.getMaterials();
    this.loadSavedOrders(); // Charger les commandes sauvegardées
  }

  // Récupérer les services via l'API
  getServices(): void {
    this.prestationService.getServices().subscribe(
      (data: any) => {
        this.services = data['hydra:member']; // Accès aux services
        console.log(this.services);
      },
      error => {
        console.error('Erreur lors de la récupération des services', error);
      }
    );
  }

  // Récupérer les articles via l'API
  getArticles(): void {
    this.articleService.getArticles().subscribe(
      (data: any) => {
        this.articles = data['hydra:member']; // Accès aux articles
        console.log(this.articles);
      },
      error => {
        console.error('Erreur lors de la récupération des articles', error);
      }
    );
  }

  // Récupérer les matériaux via l'API
  getMaterials(): void {
    this.materialService.getMaterials().subscribe(
      (data: any) => {
        this.materials = data['hydra:member']; // Accès aux matériaux
        console.log(this.materials);
      },
      error => {
        console.error('Erreur lors de la récupération des matériaux', error);
      }
    );
  }

  // Nouvelle méthode pour sélectionner un service
  selectService(service: Service): void {
    this.selectedService = service; // Assigner le service sélectionné
  }

  // Sauvegarder une commande dans le localStorage
  saveOrder(): void {
    if (this.selectedService && this.selectedArticle && this.selectedMaterial) {
      const order = {
        service: this.selectedService.service_name,
        article: this.selectedArticle,
        material: this.selectedMaterial
      };

      // Sauvegarder les commandes dans localStorage
      const existingOrders = localStorage.getItem('orders') 
        ? JSON.parse(localStorage.getItem('orders')!) 
        : [];

      existingOrders.push(order);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      // Actualiser la liste des commandes sauvegardées
      this.savedOrders = existingOrders;
    }
  }

  // Charger les commandes sauvegardées depuis le localStorage
  loadSavedOrders(): void {
    this.savedOrders = localStorage.getItem('orders') 
      ? JSON.parse(localStorage.getItem('orders')!) 
      : [];
  }
  removeOrder(index: number): void {
    // Supprimer la commande à l'index donné
    this.savedOrders.splice(index, 1);
    
    // Mettre à jour le localStorage
    localStorage.setItem('orders', JSON.stringify(this.savedOrders));
  }

  proceedToOrder(): void {
    if (this.authService.isLogged()) {
      // Redirige vers le panier si l'utilisateur est connecté
      this.router.navigate(['/panier']);
    } else {
      // Redirige vers la page de connexion si l'utilisateur n'est pas connecté
      localStorage.setItem('redirectUrl', '/panier'); // Stocker l'URL cible avant de rediriger
      this.router.navigate(['/login']);
    }
  }

  // Vérifier si l'utilisateur est authentifié (exemple simple, peut-être plus complexe selon ton service auth)
  isAuthenticated(): boolean {
    // Exemple de logique, à remplacer par ta méthode réelle d'authentification
    return !!localStorage.getItem('token'); // ou une vérification de session
  }
}
