import { Category, NearbyItem, PopularItem } from '../types/home.types';
import categoriesData from './categories.json';
import nearbyItemsData from './nearbyItems.json';
import popularItemsData from './popularItems.json';

// Mapa de imágenes por categoría - permite usar diferentes imágenes para cada una
// Por ahora todas usan city.png, pero puedes agregar imágenes específicas
const categoryImages: Record<string, ReturnType<typeof require>> = {
    tiendas: require('../assets/images/city.png'),
    restaurantes: require('../assets/images/city.png'),
    cafeterias: require('../assets/images/city.png'),
    salud: require('../assets/images/city.png'),
    belleza: require('../assets/images/city.png'),
    servicios: require('../assets/images/city.png'),
    deportes: require('../assets/images/city.png'),
    educacion: require('../assets/images/city.png'),
    tecnologia: require('../assets/images/city.png'),
    hogar: require('../assets/images/city.png'),
    default: require('../assets/images/city.png'),
};

// Centraliza la carga de datos desde los JSON y resuelve las imágenes locales
export const getPopularItems = (): PopularItem[] =>
    popularItemsData.map(item => ({
        ...item,
        image: require('../assets/images/city.png'),
    }));

export const getNearbyItems = (): NearbyItem[] =>
    nearbyItemsData.map(item => ({
        ...item,
        image: require('../assets/images/city.png'),
    }));

export const getCategories = (): Category[] =>
    categoriesData.map(category => ({
        ...category,
        image: (categoryImages[category.imageKey] || categoryImages.default) as any,
    }));
