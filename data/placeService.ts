import { RelatedPlace } from '../components/place/RelatedPlacesCarousel';
import { Comment, GalleryItem, PlaceDetails } from '../types/place.types';
import appData from './appData.json';

const assetMap: Record<string, any> = {
    'assets/images/city.png': require('../assets/images/city.png'),
};

// Generador de comentarios simulados
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateComments = (itemId: string, count: number): Comment[] => {
    const userNames = ['UsuarioFeliz', 'AmanteDeLaComida', 'CríticoGourmet', 'Visitante01', 'FoodieLatam'];
    const sampleTexts = [
        '¡Se ve delicioso! ¿Qué ingredientes lleva?',
        'La mejor pasta que he probado en la ciudad.',
        'Me encantó el ambiente, totalmente recomendado.',
        'Tengo que volver solo por este plato.',
        '¡Qué maravilla de presentación!',
        'El chef es un artista, increíble sabor.',
        '¿Aceptan reservaciones para grupos grandes?',
        'Suban la receta del postre, por favor 😋.',
        'Perfecto para una cena especial.',
        'El vino que maridaron con esto estaba espectacular.',
    ];
    const commentsArray: Comment[] = [];
    for (let i = 0; i < count; i++) {
        const nameIdx = randomInt(0, userNames.length - 1);
        const textIdx = randomInt(0, sampleTexts.length - 1);
        const month = String(randomInt(1, 12)).padStart(2, '0');
        const day = String(randomInt(1, 28)).padStart(2, '0');
        commentsArray.push({
            id: `${itemId}-c${i + 1}`,
            userName: `${userNames[nameIdx]}${randomInt(1, 999)}`,
            text: sampleTexts[textIdx],
            timestamp: `2025-${month}-${day}`,
        });
    }
    return commentsArray;
};

const resolveAsset = (path?: string) => (path ? assetMap[path] : undefined as any);

export async function fetchRelatedPlaces(): Promise<RelatedPlace[]> {
    await new Promise(r => setTimeout(r, 300));
    const places = (appData as any).places || [];
    return places.map((p: any) => {
        const details = Array.isArray(p.placeDetails) ? p.placeDetails[0] : p.placeDetails;
        const imagePath = details?.coverImage || details?.logo;
        return {
            id: p.id,
            name: p.name,
            image: resolveAsset(imagePath),
            category: p.category,
        };
    });
}

export async function fetchPlaceDetails(id: string): Promise<PlaceDetails> {
    await new Promise(r => setTimeout(r, 300));
    const placeItem = (appData as any).places?.find((x: any) => x.id === id);
    if (!placeItem) {
        throw new Error('Place not found in appData.json');
    }
    const details = Array.isArray(placeItem.placeDetails) ? placeItem.placeDetails[0] : placeItem.placeDetails;
    if (!details) {
        throw new Error('Place details not found for selected place');
    }
    const gallery: GalleryItem[] = (details.gallery || []).map((g: any) => ({
        id: String(g.id),
        title: g.title,
        type: g.type,
        url: resolveAsset(g.url),
        likes: g.likes,
        shares: g.shares,
        description: g.description,
        commentsCount: g.commentsCount,
        comments: generateComments(String(g.id), g.commentsCount || 0),
    }));
    return {
        id: placeItem.id,
        name: placeItem.name,
        description: details.description,
        logo: resolveAsset(details.logo),
        coverImage: resolveAsset(details.coverImage),
        isVerified: !!placeItem.isVerified,
        rating: placeItem.rating,
        reviews: placeItem.reviews,
        category: placeItem.category,
        subcategory: placeItem.subcategory,
        organization: placeItem.organization,
        price: placeItem.price,
        address: details.address,
        coordinates: placeItem.coordinates,
        phone: (details.phones?.[0]?.phone) || '',
        phones: details.phones,
        whatsapp: details.whatsapp,
        whatsapps: details.whatsapps,
        schedule: details.schedule,
        isOpen: placeItem.isOpen,
        website: details.website,
        emails: details.emails,
        socialMedia: details.socialMedia,
        deliveryApps: details.deliveryApps,
        gallery,
        promotions: (details.promotions || []).map((pr: any) => ({
            ...pr,
            image: resolveAsset(pr.image),
        })),
        reviewsList: (details.reviewsList || []).map((r: any) => ({
            ...r,
            userAvatar: resolveAsset(r.userAvatar),
        })),
    } as PlaceDetails;
}
