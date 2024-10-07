export interface User {
  id:number;
  user_name: string;
  user_last_name: string;
  user_genre: string; 
  user_birthday: Date; 
  user_email: string;
  user_tel: string;
  user_adress: string;
  password: string;
  user_roles: string[]; //['ROLE_USER']
}
export interface ApiListResponse<T> {
  '@id': string;
  'hydra:totalItem':number;
  'hydra:member':T[];
}
export interface Service {
  id: number;
  service_name: string;
  service_price: number;
  service_image: string;
}

export interface Article {
  id: number;
  article_name: string;
  article_price: number;
  article_image: string; // Lien vers l'image de l'article
}

export interface Material {
  id: number;
  material_name: string;
}
export interface Order {
  id?: number; // Rendre 'id' optionnel
  user_id: string;
  paiement_effect: boolean;
  status_id: string;
  paiement_id: string;
  // order_total_price:number;
}
export interface Item {
  id: number;
  article_id: number;
  service_id: number;
  material_id: number;
  total_price: number;
  // nombres_articles: number;
  order_id: string;
}
export interface Paiement {
  id:number;
  paiement_method:string;
}
export interface Status{
  id:number;
  name_status:string;
}

// export interface IUser {
//     username:string;
//     password:string;
//    }
// export interface ICredentials {
//     username: string;
//     password: string;
//   }
  
  export interface IToken {
    token: string;
  }

  
   