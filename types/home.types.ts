import { ImageSourcePropType } from 'react-native';

/**
 * Constantes centralizadas para el carrusel de categorías
 * Evita duplicación y desincronización entre estilos y lógica
 */
export const CAROUSEL_CONFIG = {
    CARD_WIDTH: 160,
    CARD_MARGIN: 12,
    CARD_HEIGHT: 100,
    BORDER_RADIUS: 16,
    get SNAP_INTERVAL() {
        return this.CARD_WIDTH + this.CARD_MARGIN;
    },
} as const;

/**
 * Constantes centralizadas para el carrusel de populares
 */
export const POPULAR_CAROUSEL_CONFIG = {
    CARD_WIDTH: 180,
    CARD_MARGIN: 16,
    CARD_HEIGHT: 220,
    BORDER_RADIUS: 16,
    get SNAP_INTERVAL() {
        return this.CARD_WIDTH + this.CARD_MARGIN;
    },
} as const;

/**
 * Constantes centralizadas para el grid de Nearby
 */
export const NEARBY_GRID_CONFIG = {
    NUM_COLUMNS: 2,
    CARD_GAP: 12,
    CARD_HEIGHT: 240,
    BORDER_RADIUS: 16,
} as const;

/**
 * Interfaz para las subcategorías
 */
export interface SubCategory {
    id: string;
    name: string;
    icon?: string; // Emoji o ícono opcional
}

/**
 * Interfaz para las categorías del carrusel
 */
export interface Category {
    id: string; // Usar string para evitar conversiones innecesarias
    name: string;
    image: ImageSourcePropType;
    /** URI opcional para imágenes de red */
    imageUri?: string;
    /** Subcategorías opcionales */
    subcategories?: SubCategory[];
}

/**
 * Interfaz para los items populares
 */
export interface PopularItem {
    id: string;
    tag: string;
    title: string;
    subtitle: string;
    price: string;
    rating: number;
    reviews: number;
    image: ImageSourcePropType;
    imageUri?: string;
}

/**
 * Interfaz para items cercanos
 */
export interface NearbyItem {
    id: string;
    tag: string;
    title: string;
    subtitle: string;
    price: string;
    rating: number;
    reviews: number;
    distance: string;
    image: ImageSourcePropType;
    imageUri?: string;
}

/**
 * Props para el componente CategoryItem
 */
export interface CategoryItemProps {
    item: Category;
    onPress?: (item: Category) => void;
    onSubcategoryPress?: (category: Category, subcategory: SubCategory) => void;
}

/**
 * Props para el componente PopularCard
 */
export interface PopularCardProps {
    item: PopularItem;
    onPress?: (item: PopularItem) => void;
}

/**
 * Props para el componente NearbyCard
 */
export interface NearbyCardProps {
    item: NearbyItem;
    onPress?: (item: NearbyItem) => void;
}

/**
 * Estado de carga de imagen
 */
export type ImageLoadState = 'idle' | 'loading' | 'loaded' | 'error';
