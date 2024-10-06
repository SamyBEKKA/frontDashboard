import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { ApiListResponse, Article, Item, Material, Order, Service, Status } from '../shared/auth';
import { OrderService } from '../shared/order.service';
import { StatusService } from '../shared/status.service';
import { ItemService } from '../shared/item.service';
import { error } from 'console';
import { PrestationService } from '../shared/prestation.service';
import { ArticleService } from '../shared/article.service';
import { MaterialService } from '../shared/material.service';

@Component({
  selector: 'app-mes-commandes',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './mes-commandes.component.html',
  styleUrl: './mes-commandes.component.css'
})
export class MesCommandesComponent implements OnInit{

  commandes: Order[] = [];
  items: Item[] = [];
  statuses: Status[] = [];
  services: Service[] = [];
  articles: Article[] = [];
  materials: Material[] = [];
  userId: string = ''; // ID de l'utilisateur connecté

  constructor(
    private commandeService: OrderService,
    private itemService: ItemService,
    private statusService: StatusService,
    private authService: AuthService,
    private prestationService: PrestationService,
    private articleService: ArticleService, 
    private materialService: MaterialService 
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getCurrentUser().id; // Récupérer l'utilisateur connecté et son ID
    this.getCommandes(); // Charger les commandes de l'utilisateur
    this.getStatuses(); // Charger les statuts
    this.getServices(); // Charger les services
    this.getArticles(); // Charger les articles
    this.getMaterials(); // Charger les matériaux
  }

  // Récupérer les services
  getServices(): void {
    this.prestationService.getServices().subscribe(
      (data: any) => {
        this.services = data['hydra:member']; // Stocker les services récupérés
      },
      error => {
        console.error('Erreur lors de la récupération des services', error);
      }
    );
  }

  // Récupérer les articles
  getArticles(): void {
    this.articleService.getArticles().subscribe(
      (data: any) => {
        this.articles = data['hydra:member']; // Stocker les articles récupérés
      },
      error => {
        console.error('Erreur lors de la récupération des articles', error);
      }
    );
  }

  // Récupérer les matériaux
  getMaterials(): void {
    this.materialService.getMaterials().subscribe(
      (data: any) => {
        this.materials = data['hydra:member']; // Stocker les matériaux récupérés
      },
      error => {
        console.error('Erreur lors de la récupération des matériaux', error);
      }
    );
  }

  // Obtenir le nom du service
  getServiceName(serviceId: number): string {
    const service = this.services.find(service => service.id === serviceId);
    return service ? service.service_name : 'Service inconnu';
  }

  // Obtenir le nom de l'article
  getArticleName(articleId: number): string {
    const article = this.articles.find(article => article.id === articleId);
    return article ? article.article_name : 'Article inconnu';
  }

  // Obtenir le nom du matériau
  getMaterialName(materialId: number): string {
    const material = this.materials.find(material => material.id === materialId);
    return material ? material.material_name : 'Matériau inconnu';
  }

  // Récupérer les commandes de l'utilisateur connecté
  getCommandes(): void {
    this.commandeService.getOrders(this.userId).subscribe(
      (data: ApiListResponse<Order>) => {
        this.commandes = data['hydra:member']; // Stocker les commandes récupérées
        this.getItems(); // Charger les items associés aux commandes
      },
      error => {
        console.error('Erreur lors de la récupération des commandes', error);
      }
    );
  }
  
  // Filtrer les items pour une commande spécifique en fonction de l'order_id
  getItemsForOrder(orderId: string): Item[] {
    return this.items.filter(item => item.order_id === orderId);
  }

  // Récupérer les items associés aux commandes de l'utilisateur via l'API
  getItems(): void {
    this.itemService.getItems(this.userId).subscribe(
      (data: ApiListResponse<Item>) => {
        this.items = data['hydra:member']; // Stocker les items récupérés
      },
      error => {
        console.error('Erreur lors de la récupération des items', error);
      }
    );
  }

  // Récupérer les statuts via l'API
  getStatuses(): void {
    this.statusService.getStatus().subscribe(
      (data: ApiListResponse<Status>) => {
        this.statuses = data['hydra:member']; // Stocker les statuts récupérés
      },
      error => {
        console.error('Erreur lors de la récupération des statuts', error);
      }
    );
  }

  // Méthode pour obtenir le statut d'une commande à partir de son ID
  getStatusName(statuId: string): string {
    const statusIdNumber = Number(statuId);
    const status = this.statuses.find(status => status.id === statusIdNumber);
    return status ? status.name_status : 'Statut inconnu';
  }
  
  
 
}
