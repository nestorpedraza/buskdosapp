import type { ChatItem } from '../components/chats/ChatRow';
import type { MapMarker } from '../components/map/AppMap';
import { Category, NearbyItem, PopularItem } from '../types/home.types';
import appData from './appData.json';
// Devuelve todos los chats de los lugares en formato ChatItem
export const getChatsFromPlaces = (): ChatItem[] => {
    const places: any[] = (appData as any).places || [];
    const rows: ChatItem[] = [];
    places.forEach((p: any) => {
        const details = Array.isArray(p.placeDetails) ? p.placeDetails[0] : p.placeDetails;
        const avatar = resolveAsset(details?.logo) || require('../assets/images/city.png');
        const chatsArr: any[] = (p.Chats || []);
        chatsArr.forEach((c: any, idx: number) => {
            rows.push({
                id: `${p.id}-c${idx + 1}`,
                placeName: p.name,
                lastMessage: String(c.lastMessage || ''),
                lastTimestamp: Number(c.lastTimestamp || Date.now()),
                unreadCount: typeof c.unreadCount === 'number' ? c.unreadCount : 0,
                avatar,
            });
        });
    });
    return rows;
};

// Mapa de imágenes por categoría - permite usar diferentes imágenes para cada una
// Por ahora todas usan city.png, pero puedes agregar imágenes específicas
const assetMap: Record<string, any> = {
    'assets/images/city.png': require('../assets/images/city.png'),
    'assets/images/buskados_vectorizado_200x200.png': require('../assets/images/buskados_vectorizado_200x200.png'),
};

const resolveAsset = (path?: string) => (path ? assetMap[path] : assetMap['assets/images/city.png']);

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
            isVerified: !!p.isVerified,
            image: require('../assets/images/city.png'),
        }));
};

export const getNearbyItems = (): NearbyItem[] => {
    return (appData.places || []).map(p => ({
        id: p.id,
        tag: p.tag,
        title: p.name,
        subtitle: p.subtitle,
        rating: p.rating,
        reviews: p.reviews || 0,
        distance: p.distance || '',
        isVerified: !!p.isVerified,
        image: require('../assets/images/city.png'),
    }));
};

export const getCategories = (): Category[] =>
    (appData.categories || []).map((category: any) => ({
        ...category,
        image: resolveAsset(category.imageUrl) as any,
    }));

export const getMapMarkers = (): MapMarker[] => {
    const fold = (s?: string) =>
        String(s || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    const categoriesList: any[] = (appData as any).categories || [];
    const keyMap: Record<string, string> = {};
    categoriesList.forEach((c: any) => {
        if (c?.imageKey) {
            keyMap[fold(c.imageKey)] = c.imageKey;
        }
        if (c?.name) {
            keyMap[fold(c.name)] = c.imageKey;
        }
    });
    return (appData.places || [])
        .map((p: any) => {
            const hasCoords = p.coordinates && typeof p.coordinates.latitude === 'number' && typeof p.coordinates.longitude === 'number';
            const hasLatLng = typeof p.lat === 'number' && typeof p.lng === 'number';
            if (!hasCoords && !hasLatLng) return null;
            const coords = hasCoords
                ? { latitude: p.coordinates.latitude, longitude: p.coordinates.longitude }
                : { latitude: p.lat, longitude: p.lng };
            const catKey = keyMap[fold(p.category)] || p.category || (categoriesList[0]?.imageKey || 'tiendas');
            return {
                id: p.id,
                name: p.name,
                category: catKey,
                tag: p.tag,
                rating: p.rating,
                distance: p.distance || '',
                lat: coords.latitude,
                lng: coords.longitude,
                isVerified: !!p.isVerified,
            } as MapMarker;
        })
        .filter(Boolean) as MapMarker[];
};

export const getOrganizations = () => {
    const list: any[] = (appData as any).organizations || [];
    return list.map((o: any) => {
        const type = o?.type === 'juridica' ? 'juridica' : 'natural';
        const base: any = {
            id: String(o?.id || ''),
            type,
            logo: resolveAsset(o?.logo),
        };
        if (type === 'juridica') {
            return {
                ...base,
                legalName: String(o?.legalName || ''),
                taxId: String(o?.taxId || ''),
                corporateEmail: o?.corporateEmail ? String(o.corporateEmail) : undefined,
                hqAddress: o?.hqAddress ? String(o.hqAddress) : undefined,
            };
        }
        return {
            ...base,
            personalName: String(o?.personalName || ''),
            nationalId: String(o?.nationalId || ''),
        };
    });
};

export const getPlacesByOrganization = (orgName: string) => {
    const fold = (s?: string) =>
        String(s || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
    const target = fold(orgName);
    return (appData.places || [])
        .filter((p: any) => fold(p.organization) === target)
        .map((p: any) => ({
            id: p.id,
            name: p.name,
            subtitle: p.subtitle,
            tag: p.tag,
            rating: p.rating,
            reviews: p.reviews || 0,
            distance: p.distance || '',
            isVerified: !!p.isVerified,
            image: resolveAsset(p.placeDetails?.[0]?.logo || 'assets/images/city.png'),
        }));
};

export const getPlacesByOrganizationId = (orgId: string) => {
    const fold = (s?: string) => String(s || '').trim();
    const target = fold(orgId);
    return (appData.places || [])
        .filter((p: any) => fold(p.idOrganization) === target)
        .map((p: any) => {
            const details = Array.isArray(p.placeDetails) ? p.placeDetails[0] : p.placeDetails;
            return {
                id: p.id,
                name: p.name,
                category: p.category,
                subcategory: p.subcategory,
                tag: p.tag,
                subtitle: p.subtitle,
                price: p.price,
                rating: p.rating,
                reviews: p.reviews || 0,
                distance: p.distance || '',
                isVerified: !!p.isVerified,
                organization: p.organization,
                idOrganization: p.idOrganization,
                image: resolveAsset(details?.logo || 'assets/images/city.png'),
            };
        });
};
