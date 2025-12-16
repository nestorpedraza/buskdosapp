import type { MapMarker } from '../components/AppMap';
import { Category, NearbyItem, PopularItem } from '../types/home.types';
import appData from './appData.json';

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
export const getPopularItems = (): PopularItem[] => {
    const popularSet = new Set(appData.popularIds || []);
    return (appData.places || [])
        .filter(p => popularSet.has(p.id))
        .map(p => ({
            id: p.id,
            tag: p.tag,
            title: p.name,
            subtitle: p.subtitle,
            price: p.price || '',
            rating: p.rating,
            reviews: p.reviews || 0,
            image: require('../assets/images/city.png'),
        }));
};

export const getNearbyItems = (): NearbyItem[] => {
    return (appData.places || []).map(p => ({
        id: p.id,
        tag: p.tag,
        title: p.name,
        subtitle: p.subtitle,
        price: p.price || '',
        rating: p.rating,
        reviews: p.reviews || 0,
        distance: p.distance || '',
        image: require('../assets/images/city.png'),
    }));
};

export const getCategories = (): Category[] =>
    (appData.categories || []).map((category: any) => ({
        ...category,
        image: (categoryImages[category.imageKey] || categoryImages.default) as any,
    }));

// Map markers for Medellín
const randomAroundMedellin = () => ({
    latitude: 6.2442 + (Math.random() - 0.5) * 0.05,
    longitude: -75.5812 + (Math.random() - 0.5) * 0.05,
});

export const getMapMarkers = (): MapMarker[] => {
    return (appData.places || []).map((p: any) => {
        const coords = p.lat && p.lng
            ? { latitude: p.lat, longitude: p.lng }
            : randomAroundMedellin();
        return {
            id: p.id,
            name: p.name,
            category: p.category,
            tag: p.tag,
            rating: p.rating,
            distance: p.distance || '',
            lat: coords.latitude,
            lng: coords.longitude,
        };
    });
};
