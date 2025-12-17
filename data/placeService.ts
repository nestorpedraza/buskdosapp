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
    const rp = (appData as any).relatedPlaces || [];
    return rp.map((p: any) => ({
        id: p.id,
        name: p.name,
        image: resolveAsset(p.image),
        category: p.category,
    }));
}

export async function fetchPlaceDetails(id: string): Promise<PlaceDetails> {
    await new Promise(r => setTimeout(r, 300));
    const placeItem = (appData as any).places?.find((x: any) => x.id === id);
    const nested = placeItem?.placeDetails;
    const topLevelList = (appData as any).placeDetails || [];
    const p = nested || topLevelList.find((x: any) => x.id === id) || topLevelList[0];
    if (!p) {
        throw new Error('No place details in appData.json');
    }
    const gallery: GalleryItem[] = (p.gallery || []).map((g: any) => ({
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
        id: p.id,
        name: p.name,
        description: p.description,
        logo: resolveAsset(p.logo),
        coverImage: resolveAsset(p.coverImage),
        isVerified: !!p.isVerified,
        rating: p.rating,
        reviews: p.reviews,
        category: p.category,
        subcategory: p.subcategory,
        organization: p.organization,
        price: p.price,
        address: p.address,
        coordinates: p.coordinates,
        phone: p.phone,
        phones: p.phones,
        whatsapp: p.whatsapp,
        whatsapps: p.whatsapps,
        schedule: p.schedule,
        isOpen: p.isOpen,
        website: p.website,
        emails: p.emails,
        socialMedia: p.socialMedia,
        deliveryApps: p.deliveryApps,
        gallery,
        promotions: (p.promotions || []).map((pr: any) => ({
            ...pr,
            image: resolveAsset(pr.image),
        })),
        reviewsList: (p.reviewsList || []).map((r: any) => ({
            ...r,
            userAvatar: resolveAsset(r.userAvatar),
        })),
    } as PlaceDetails;
}
