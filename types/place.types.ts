import { ImageSourcePropType } from 'react-native';

export interface PlaceSchedule {
    weekdays: string;      // Lun - Vie
    saturday?: string;     // Sábado
    sunday?: string;       // Domingo
}

export interface PlaceDetails {
    id: string;
    name: string;
    description: string;
    logo: ImageSourcePropType;
    coverImage: ImageSourcePropType;
    isVerified: boolean;
    rating: number;
    reviews: number;
    category: string;
    subcategory: string;
    organization?: string;
    price: string;

    // Contacto
    address: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    phone: string;
    whatsapp: string;
    schedule: string | PlaceSchedule;
    isOpen?: boolean;
    website: string;
    /** Correos electrónicos de contacto, con tipo/rol */
    emails?: { type: string; email: string }[];

    // Redes sociales
    socialMedia: SocialMediaLinks;

    // Apps de domicilios
    deliveryApps: DeliveryAppLinks;

    // Galería
    gallery: GalleryItem[];

    // Promociones
    promotions?: Promotion[];

    // Reseñas/Comentarios
    reviewsList?: PlaceReview[];
}

export interface Promotion {
    id: string;
    title: string;
    description: string;
    discount: string; // Ej: "20% OFF", "2x1", "$10.000 OFF"
    image: ImageSourcePropType;
    validUntil: string; // Fecha ISO
    code?: string; // Código de descuento opcional
    type?: 'regular' | 'flash' | 'exclusive';
    terms?: string;
}

export interface SocialMediaLinks {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
    pinterest?: string;
    snapchat?: string;
    telegram?: string;
    discord?: string;
}

export interface DeliveryAppLinks {
    rappi?: string;
    didifood?: string;
    ubereats?: string;
    ifood?: string;
    domicilios?: string;
    merqueo?: string;
    mensajerosurbanos?: string;
    picap?: string;
}

export interface GalleryItem {
    id: string;
    type: 'image' | 'video';
    url: ImageSourcePropType;
    thumbnail?: ImageSourcePropType;
    likes: number;
    comments: number;
    shares: number;
    description?: string;
    isLiked?: boolean;
    isFavorite?: boolean;
}

export interface PlaceReview {
    id: string;
    userName: string;
    userAvatar: ImageSourcePropType;
    rating: number;
    comment: string;
    date: string;
    likes: number;
}
