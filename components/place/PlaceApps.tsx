import React from 'react';
import { DeliveryAppLinks, SocialMediaLinks } from '../../types/place.types';
import PlaceDeliveryApps from './PlaceDeliveryApps';
import PlaceSocialApps from './PlaceSocialApps';

interface PlaceAppsProps {
    socialMedia: SocialMediaLinks;
    deliveryApps: DeliveryAppLinks;
}

export default function PlaceApps({ socialMedia, deliveryApps }: PlaceAppsProps) {
    return (
        <>
            <PlaceSocialApps socialMedia={socialMedia} />
            <PlaceDeliveryApps deliveryApps={deliveryApps} />
        </>
    );
}
