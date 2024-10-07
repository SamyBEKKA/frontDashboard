import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { ApiListResponse, Article, Item, Material, Order, Service, Status, User } from '../shared/auth';
import { OrderService } from '../shared/order.service';
import { StatusService } from '../shared/status.service';
import { ItemService } from '../shared/item.service';
import { error } from 'console';
import { PrestationService } from '../shared/prestation.service';
import { ArticleService } from '../shared/article.service';
import { MaterialService } from '../shared/material.service';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-mes-commandes',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './mes-commandes.component.html',
  styleUrl: './mes-commandes.component.css'
})
export class MesCommandesComponent implements OnInit {
  commandes: Order[] = [];
  items: Item[] = [];
  statuses: Status[] = [];
  services: Service[] = [];
  articles: Article[] = [];
  materials: Material[] = [];
  usernames: { [key: string]: string } = {};  // Dictionnaire pour stocker les usernames
  userId: string = ''; // ID de l'utilisateur connecté

  constructor(
    private authService: AuthService,
    private commandeService: OrderService,
    private itemService: ItemService,
    private statusService: StatusService,
    private prestationService: PrestationService,
    private articleService: ArticleService,
    private materialService: MaterialService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.error('Utilisateur non authentifié');
      return;
    }

    this.userId = currentUser.id || currentUser.username;
    this.loadData();
  }

  // Charger toutes les données nécessaires
  loadData(): void {
    forkJoin({
      commandes: this.commandeService.getOrders(this.userId),
      items: this.itemService.getItems(this.userId),
      statuses: this.statusService.getStatus(),
      services: this.prestationService.getServices(),
      articles: this.articleService.getArticles(),
      materials: this.materialService.getMaterials()
    }).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des données', error);
        return of({
          commandes: { 'hydra:member': [] },
          items: { 'hydra:member': [] },
          statuses: { 'hydra:member': [] },
          services: { 'hydra:member': [] },
          articles: { 'hydra:member': [] },
          materials: { 'hydra:member': [] }
        });
      })
    ).subscribe((data: any) => {
      this.commandes = data.commandes['hydra:member'];
      this.items = data.items['hydra:member'];
      this.statuses = data.statuses['hydra:member'];
      this.services = data.services['hydra:member'];
      this.articles = data.articles['hydra:member'];
      this.materials = data.materials['hydra:member'];

      // Récupérer le username de l'utilisateur pour chaque commande
      this.commandes.forEach(commande => {
        if (commande.user_id && !this.usernames[commande.user_id]) {
          this.getUserUsername(commande.user_id);
        }
      });
    });
  }

  // Méthode pour récupérer le username d'un utilisateur par son ID
  getUserUsername(userId: string): void {
    this.authService.getUserById(userId).subscribe(
      (user: User) => this.usernames[userId] = user.user_name || 'Utilisateur inconnu',
      error => {
        console.error(`Erreur lors de la récupération du username pour l'utilisateur ${userId}`, error);
        this.usernames[userId] = 'Utilisateur inconnu';
      }
    );
  }

  // Méthode générique pour obtenir le nom (Service, Article, Matériaux) à partir de l'ID
  getNameById(id: number, collection: any[], nameField: string): string {
    const item = collection.find(el => el.id === id);
    return item ? item[nameField] : 'Inconnu';
  }

  // Récupérer les items associés à une commande
  getItemsForOrder(orderId: string): Item[] {
    return this.items.filter(item => item.order_id === orderId);
  }

  // Méthode pour obtenir le statut d'une commande à partir de son ID
  getStatusName(statusId: string): string {
    return this.getNameById(Number(statusId), this.statuses, 'name_status');
  }

  // Méthode pour obtenir le nom du service
  getServiceName(serviceId: number): string {
    return this.getNameById(serviceId, this.services, 'service_name');
  }

  // Méthode pour obtenir le nom de l'article
  getArticleName(articleId: number): string {
    return this.getNameById(articleId, this.articles, 'article_name');
  }

  // Méthode pour obtenir le nom du matériau
  getMaterialName(materialId: number): string {
    return this.getNameById(materialId, this.materials, 'material_name');
  }

  // Méthode pour obtenir le nom de l'utilisateur (username) associé à une commande
  getUsernameForOrder(userId: string): string {
    return this.usernames[userId] || 'Utilisateur inconnu';
  }
}
