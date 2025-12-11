import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import HomeTabBar from '../components/HomeTabBar';

const { width, height } = Dimensions.get('window');

interface MapMarker {
    id: string;
    name: string;
    category: string;
    rating: number;
    distance: string;
    lat: number;
    lng: number;
}

export default function MapScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const bottomSheetAnim = React.useRef(new Animated.Value(0)).current;

    const categories = useMemo(() => [
        { id: 'all', name: 'Todos', icon: '🌐' },
        { id: 'restaurant', name: 'Restaurantes', icon: '🍽️' },
        { id: 'cafe', name: 'Cafeterías', icon: '☕' },
        { id: 'shop', name: 'Tiendas', icon: '🛍️' },
        { id: 'gym', name: 'Gimnasios', icon: '💪' },
        { id: 'health', name: 'Salud', icon: '🏥' },
    ], []);

    const nearbyPlaces = useMemo<MapMarker[]>(() => [
        // Restaurantes (50)
        { id: '1', name: 'La Casa del Sabor', category: 'restaurant', rating: 4.9, distance: '0.5 km', lat: 0, lng: 0 },
        { id: '2', name: 'El Buen Gusto', category: 'restaurant', rating: 4.7, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '3', name: 'Sabores del Mar', category: 'restaurant', rating: 4.8, distance: '1.1 km', lat: 0, lng: 0 },
        { id: '4', name: 'Pizzería Italia', category: 'restaurant', rating: 4.6, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '5', name: 'Asadero la Zona', category: 'restaurant', rating: 4.5, distance: '1.3 km', lat: 0, lng: 0 },
        { id: '6', name: 'Comida Rápida Premium', category: 'restaurant', rating: 4.4, distance: '0.6 km', lat: 0, lng: 0 },
        { id: '7', name: 'Restaurante Chino', category: 'restaurant', rating: 4.8, distance: '1.2 km', lat: 0, lng: 0 },
        { id: '8', name: 'Cocina Fusión', category: 'restaurant', rating: 4.7, distance: '1.4 km', lat: 0, lng: 0 },
        { id: '9', name: 'El Típico', category: 'restaurant', rating: 4.6, distance: '0.7 km', lat: 0, lng: 0 },
        { id: '10', name: 'Manjar Casa', category: 'restaurant', rating: 4.8, distance: '1.0 km', lat: 0, lng: 0 },
        { id: '11', name: 'Delicias Gourmet', category: 'restaurant', rating: 4.9, distance: '1.5 km', lat: 0, lng: 0 },
        { id: '12', name: 'La Parrilla', category: 'restaurant', rating: 4.5, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '13', name: 'Comida Casera', category: 'restaurant', rating: 4.7, distance: '1.1 km', lat: 0, lng: 0 },
        { id: '14', name: 'Restaurante Francés', category: 'restaurant', rating: 4.8, distance: '1.3 km', lat: 0, lng: 0 },
        { id: '15', name: 'Taberna del Pueblo', category: 'restaurant', rating: 4.4, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '16', name: 'Sushi Palace', category: 'restaurant', rating: 4.9, distance: '0.4 km', lat: 0, lng: 0 },
        { id: '17', name: 'Tacos El Güero', category: 'restaurant', rating: 4.6, distance: '0.7 km', lat: 0, lng: 0 },
        { id: '18', name: 'Steakhouse Premium', category: 'restaurant', rating: 4.8, distance: '1.2 km', lat: 0, lng: 0 },
        { id: '19', name: 'Veggie Delight', category: 'restaurant', rating: 4.7, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '20', name: 'Wings & Beer', category: 'restaurant', rating: 4.5, distance: '1.0 km', lat: 0, lng: 0 },
        { id: '21', name: 'Mariscos Frescos', category: 'restaurant', rating: 4.8, distance: '1.4 km', lat: 0, lng: 0 },
        { id: '22', name: 'Pasta & Vino', category: 'restaurant', rating: 4.7, distance: '0.6 km', lat: 0, lng: 0 },
        { id: '23', name: 'BBQ Master', category: 'restaurant', rating: 4.9, distance: '1.1 km', lat: 0, lng: 0 },
        { id: '24', name: 'Curry House', category: 'restaurant', rating: 4.6, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '25', name: 'El Rincón Mexicano', category: 'restaurant', rating: 4.8, distance: '1.3 km', lat: 0, lng: 0 },
        { id: '26', name: 'Brunch Spot', category: 'restaurant', rating: 4.7, distance: '0.5 km', lat: 0, lng: 0 },
        { id: '27', name: 'Mediterranean Bistro', category: 'restaurant', rating: 4.9, distance: '1.5 km', lat: 0, lng: 0 },
        { id: '28', name: 'Ramen Shop', category: 'restaurant', rating: 4.6, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '29', name: 'La Terraza', category: 'restaurant', rating: 4.8, distance: '1.0 km', lat: 0, lng: 0 },
        { id: '30', name: 'Burguer Gourmet', category: 'restaurant', rating: 4.5, distance: '0.7 km', lat: 0, lng: 0 },
        { id: '31', name: 'Thai Kitchen', category: 'restaurant', rating: 4.7, distance: '1.2 km', lat: 0, lng: 0 },
        { id: '32', name: 'Pollo Asado Express', category: 'restaurant', rating: 4.4, distance: '0.6 km', lat: 0, lng: 0 },
        { id: '33', name: 'Sandwich Factory', category: 'restaurant', rating: 4.6, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '34', name: 'La Esquina del Sabor', category: 'restaurant', rating: 4.8, distance: '1.1 km', lat: 0, lng: 0 },
        { id: '35', name: 'Hot Dog Station', category: 'restaurant', rating: 4.5, distance: '0.5 km', lat: 0, lng: 0 },
        { id: '36', name: 'Teppanyaki Grill', category: 'restaurant', rating: 4.9, distance: '1.4 km', lat: 0, lng: 0 },
        { id: '37', name: 'Ensaladas Frescas', category: 'restaurant', rating: 4.7, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '38', name: 'Empanadas House', category: 'restaurant', rating: 4.6, distance: '1.0 km', lat: 0, lng: 0 },
        { id: '39', name: 'Arepa Central', category: 'restaurant', rating: 4.8, distance: '0.7 km', lat: 0, lng: 0 },
        { id: '40', name: 'Peruvian Flavors', category: 'restaurant', rating: 4.9, distance: '1.3 km', lat: 0, lng: 0 },
        { id: '41', name: 'Brazilian Grill', category: 'restaurant', rating: 4.7, distance: '1.5 km', lat: 0, lng: 0 },
        { id: '42', name: 'Dim Sum Palace', category: 'restaurant', rating: 4.8, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '43', name: 'Smoothie Bowl Cafe', category: 'restaurant', rating: 4.6, distance: '0.6 km', lat: 0, lng: 0 },
        { id: '44', name: 'Falafel Corner', category: 'restaurant', rating: 4.5, distance: '1.1 km', lat: 0, lng: 0 },
        { id: '45', name: 'Poke Bowl Station', category: 'restaurant', rating: 4.9, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '46', name: 'Korean BBQ', category: 'restaurant', rating: 4.8, distance: '1.2 km', lat: 0, lng: 0 },
        { id: '47', name: 'La Cantina', category: 'restaurant', rating: 4.7, distance: '0.7 km', lat: 0, lng: 0 },
        { id: '48', name: 'Fish & Chips', category: 'restaurant', rating: 4.6, distance: '1.0 km', lat: 0, lng: 0 },
        { id: '49', name: 'Wok Express', category: 'restaurant', rating: 4.8, distance: '0.5 km', lat: 0, lng: 0 },
        { id: '50', name: 'El Fogón', category: 'restaurant', rating: 4.9, distance: '1.4 km', lat: 0, lng: 0 },

        // Cafeterías (50)
        { id: '51', name: 'Café Aroma', category: 'cafe', rating: 4.7, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '52', name: 'Coffee Break', category: 'cafe', rating: 4.6, distance: '0.5 km', lat: 0, lng: 0 },
        { id: '53', name: 'El Café de Don Juan', category: 'cafe', rating: 4.8, distance: '1.0 km', lat: 0, lng: 0 },
        { id: '54', name: 'Barista Premium', category: 'cafe', rating: 4.9, distance: '0.7 km', lat: 0, lng: 0 },
        { id: '55', name: 'Cafetería Mi Rincón', category: 'cafe', rating: 4.5, distance: '1.2 km', lat: 0, lng: 0 },
        { id: '56', name: 'Espresso Bar', category: 'cafe', rating: 4.7, distance: '0.6 km', lat: 0, lng: 0 },
        { id: '57', name: 'Café & Pasteles', category: 'cafe', rating: 4.8, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '58', name: 'The Coffee House', category: 'cafe', rating: 4.6, distance: '1.1 km', lat: 0, lng: 0 },
        { id: '59', name: 'Café Bohemio', category: 'cafe', rating: 4.7, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '60', name: 'La Taza Mágica', category: 'cafe', rating: 4.5, distance: '1.0 km', lat: 0, lng: 0 },
        { id: '61', name: 'Café Gourmet', category: 'cafe', rating: 4.9, distance: '0.7 km', lat: 0, lng: 0 },
        { id: '62', name: 'Cafetería del Centro', category: 'cafe', rating: 4.4, distance: '0.5 km', lat: 0, lng: 0 },
        { id: '63', name: 'Café Clásico', category: 'cafe', rating: 4.6, distance: '1.2 km', lat: 0, lng: 0 },
        { id: '64', name: 'Barista & Co', category: 'cafe', rating: 4.8, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '65', name: 'El Café Perfecto', category: 'cafe', rating: 4.7, distance: '1.1 km', lat: 0, lng: 0 },
        { id: '66', name: 'Latte Art Studio', category: 'cafe', rating: 4.9, distance: '0.6 km', lat: 0, lng: 0 },
        { id: '67', name: 'Café Literario', category: 'cafe', rating: 4.8, distance: '1.3 km', lat: 0, lng: 0 },
        { id: '68', name: 'Morning Brew', category: 'cafe', rating: 4.7, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '69', name: 'Café Orgánico', category: 'cafe', rating: 4.6, distance: '1.0 km', lat: 0, lng: 0 },
        { id: '70', name: 'The Daily Grind', category: 'cafe', rating: 4.8, distance: '0.7 km', lat: 0, lng: 0 },
        { id: '71', name: 'Café con Leche', category: 'cafe', rating: 4.5, distance: '1.4 km', lat: 0, lng: 0 },
        { id: '72', name: 'Cappuccino Corner', category: 'cafe', rating: 4.9, distance: '0.5 km', lat: 0, lng: 0 },
        { id: '73', name: 'Café Vintage', category: 'cafe', rating: 4.7, distance: '1.1 km', lat: 0, lng: 0 },
        { id: '74', name: 'Bean There', category: 'cafe', rating: 4.6, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '75', name: 'Café Moderno', category: 'cafe', rating: 4.8, distance: '1.2 km', lat: 0, lng: 0 },
        { id: '76', name: 'Coffee Lab', category: 'cafe', rating: 4.9, distance: '0.6 km', lat: 0, lng: 0 },
        { id: '77', name: 'Café Terraza', category: 'cafe', rating: 4.7, distance: '1.5 km', lat: 0, lng: 0 },
        { id: '78', name: 'Urban Coffee', category: 'cafe', rating: 4.8, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '79', name: 'Café Express', category: 'cafe', rating: 4.5, distance: '1.0 km', lat: 0, lng: 0 },
        { id: '80', name: 'French Press Cafe', category: 'cafe', rating: 4.9, distance: '0.7 km', lat: 0, lng: 0 },
        { id: '81', name: 'Café Tranquilo', category: 'cafe', rating: 4.6, distance: '1.3 km', lat: 0, lng: 0 },
        { id: '82', name: 'Mocha Madness', category: 'cafe', rating: 4.8, distance: '0.5 km', lat: 0, lng: 0 },
        { id: '83', name: 'Café Artesanal', category: 'cafe', rating: 4.7, distance: '1.1 km', lat: 0, lng: 0 },
        { id: '84', name: 'Cold Brew Bar', category: 'cafe', rating: 4.9, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '85', name: 'Café Social', category: 'cafe', rating: 4.6, distance: '1.2 km', lat: 0, lng: 0 },
        { id: '86', name: 'Roasted Beans', category: 'cafe', rating: 4.8, distance: '0.6 km', lat: 0, lng: 0 },
        { id: '87', name: 'Café Patio', category: 'cafe', rating: 4.7, distance: '1.4 km', lat: 0, lng: 0 },
        { id: '88', name: 'Java Junction', category: 'cafe', rating: 4.5, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '89', name: 'Café Acogedor', category: 'cafe', rating: 4.9, distance: '1.0 km', lat: 0, lng: 0 },
        { id: '90', name: 'Brew Bistro', category: 'cafe', rating: 4.8, distance: '0.7 km', lat: 0, lng: 0 },
        { id: '91', name: 'Café Familiar', category: 'cafe', rating: 4.6, distance: '1.5 km', lat: 0, lng: 0 },
        { id: '92', name: 'Nitro Coffee', category: 'cafe', rating: 4.9, distance: '0.5 km', lat: 0, lng: 0 },
        { id: '93', name: 'Café Jardín', category: 'cafe', rating: 4.7, distance: '1.1 km', lat: 0, lng: 0 },
        { id: '94', name: 'Steamy Mugs', category: 'cafe', rating: 4.8, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '95', name: 'Café Gallery', category: 'cafe', rating: 4.6, distance: '1.3 km', lat: 0, lng: 0 },
        { id: '96', name: 'Pour Over Place', category: 'cafe', rating: 4.9, distance: '0.6 km', lat: 0, lng: 0 },
        { id: '97', name: 'Café Underground', category: 'cafe', rating: 4.7, distance: '1.2 km', lat: 0, lng: 0 },
        { id: '98', name: 'Sip & Relax', category: 'cafe', rating: 4.8, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '99', name: 'Café Cultura', category: 'cafe', rating: 4.5, distance: '1.0 km', lat: 0, lng: 0 },
        { id: '100', name: 'The Coffee Spot', category: 'cafe', rating: 4.9, distance: '0.7 km', lat: 0, lng: 0 },

        // Tiendas (50)
        { id: '101', name: 'Boutique Fashion', category: 'shop', rating: 4.8, distance: '0.3 km', lat: 0, lng: 0 },
        { id: '102', name: 'Centro Comercial', category: 'shop', rating: 4.5, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '103', name: 'Tienda Deportiva', category: 'shop', rating: 4.6, distance: '1.0 km', lat: 0, lng: 0 },
        { id: '104', name: 'Ropa y Accesorios', category: 'shop', rating: 4.7, distance: '0.7 km', lat: 0, lng: 0 },
        { id: '105', name: 'Electrónica Premium', category: 'shop', rating: 4.9, distance: '1.2 km', lat: 0, lng: 0 },
        { id: '106', name: 'Zapatos Premium', category: 'shop', rating: 4.6, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '107', name: 'Joyería Elegancia', category: 'shop', rating: 4.8, distance: '1.1 km', lat: 0, lng: 0 },
        { id: '108', name: 'Tienda de Belleza', category: 'shop', rating: 4.7, distance: '0.6 km', lat: 0, lng: 0 },
        { id: '109', name: 'Hogar & Decoración', category: 'shop', rating: 4.5, distance: '1.0 km', lat: 0, lng: 0 },
        { id: '110', name: 'Librería Premium', category: 'shop', rating: 4.8, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '111', name: 'Tienda de Juguetes', category: 'shop', rating: 4.4, distance: '1.3 km', lat: 0, lng: 0 },
        { id: '112', name: 'Perfumería', category: 'shop', rating: 4.6, distance: '0.7 km', lat: 0, lng: 0 },
        { id: '113', name: 'Ropa Casual', category: 'shop', rating: 4.5, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '114', name: 'Tienda de Artesanías', category: 'shop', rating: 4.7, distance: '1.2 km', lat: 0, lng: 0 },
        { id: '115', name: 'Moda Actual', category: 'shop', rating: 4.6, distance: '0.6 km', lat: 0, lng: 0 },
        { id: '116', name: 'Tech Store', category: 'shop', rating: 4.9, distance: '1.4 km', lat: 0, lng: 0 },
        { id: '117', name: 'Vintage Shop', category: 'shop', rating: 4.8, distance: '0.5 km', lat: 0, lng: 0 },
        { id: '118', name: 'Tienda Naturista', category: 'shop', rating: 4.7, distance: '1.1 km', lat: 0, lng: 0 },
        { id: '119', name: 'Mascotas Felices', category: 'shop', rating: 4.6, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '120', name: 'Papelería Moderna', category: 'shop', rating: 4.5, distance: '1.0 km', lat: 0, lng: 0 },
        { id: '121', name: 'Supermercado Local', category: 'shop', rating: 4.8, distance: '0.7 km', lat: 0, lng: 0 },
        { id: '122', name: 'Floristería', category: 'shop', rating: 4.9, distance: '1.5 km', lat: 0, lng: 0 },
        { id: '123', name: 'Tienda de Música', category: 'shop', rating: 4.7, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '124', name: 'Optica Vision', category: 'shop', rating: 4.6, distance: '1.2 km', lat: 0, lng: 0 },
        { id: '125', name: 'Tienda Gourmet', category: 'shop', rating: 4.9, distance: '0.6 km', lat: 0, lng: 0 },
        { id: '126', name: 'Bazar Universal', category: 'shop', rating: 4.5, distance: '1.3 km', lat: 0, lng: 0 },
        { id: '127', name: 'Relojería Suiza', category: 'shop', rating: 4.8, distance: '0.5 km', lat: 0, lng: 0 },
        { id: '128', name: 'Tienda Ecológica', category: 'shop', rating: 4.7, distance: '1.1 km', lat: 0, lng: 0 },
        { id: '129', name: 'Boutique Infantil', category: 'shop', rating: 4.6, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '130', name: 'Ferretería Total', category: 'shop', rating: 4.8, distance: '1.0 km', lat: 0, lng: 0 },
        { id: '131', name: 'Tienda de Camping', category: 'shop', rating: 4.9, distance: '0.7 km', lat: 0, lng: 0 },
        { id: '132', name: 'Arte y Manualidades', category: 'shop', rating: 4.7, distance: '1.4 km', lat: 0, lng: 0 },
        { id: '133', name: 'Mundo Gamer', category: 'shop', rating: 4.8, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '134', name: 'Tienda de Té', category: 'shop', rating: 4.6, distance: '1.2 km', lat: 0, lng: 0 },
        { id: '135', name: 'Chocolatería Suiza', category: 'shop', rating: 4.9, distance: '0.6 km', lat: 0, lng: 0 },
        { id: '136', name: 'Tienda de Bicicletas', category: 'shop', rating: 4.7, distance: '1.5 km', lat: 0, lng: 0 },
        { id: '137', name: 'Mercado Orgánico', category: 'shop', rating: 4.8, distance: '0.5 km', lat: 0, lng: 0 },
        { id: '138', name: 'Souvenirs Shop', category: 'shop', rating: 4.5, distance: '1.1 km', lat: 0, lng: 0 },
        { id: '139', name: 'Tienda de Vinos', category: 'shop', rating: 4.9, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '140', name: 'Bolsos y Carteras', category: 'shop', rating: 4.7, distance: '1.3 km', lat: 0, lng: 0 },
        { id: '141', name: 'Tienda de Cocina', category: 'shop', rating: 4.6, distance: '0.7 km', lat: 0, lng: 0 },
        { id: '142', name: 'Muebles Modernos', category: 'shop', rating: 4.8, distance: '1.0 km', lat: 0, lng: 0 },
        { id: '143', name: 'Tienda Náutica', category: 'shop', rating: 4.7, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '144', name: 'Galería de Arte', category: 'shop', rating: 4.9, distance: '1.2 km', lat: 0, lng: 0 },
        { id: '145', name: 'Tienda de Alfombras', category: 'shop', rating: 4.6, distance: '0.6 km', lat: 0, lng: 0 },
        { id: '146', name: 'Antigüedades', category: 'shop', rating: 4.8, distance: '1.4 km', lat: 0, lng: 0 },
        { id: '147', name: 'Tienda de Drones', category: 'shop', rating: 4.9, distance: '0.5 km', lat: 0, lng: 0 },
        { id: '148', name: 'Colchones Premium', category: 'shop', rating: 4.7, distance: '1.1 km', lat: 0, lng: 0 },
        { id: '149', name: 'Tienda de Skate', category: 'shop', rating: 4.8, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '150', name: 'Mercería La Aguja', category: 'shop', rating: 4.5, distance: '1.5 km', lat: 0, lng: 0 },

        // Gimnasios (50)
        { id: '151', name: 'FitLife Center', category: 'gym', rating: 4.6, distance: '1.2 km', lat: 0, lng: 0 },
        { id: '152', name: 'Power Gym', category: 'gym', rating: 4.8, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '153', name: 'Fitness Club', category: 'gym', rating: 4.5, distance: '1.0 km', lat: 0, lng: 0 },
        { id: '154', name: 'Elite Training', category: 'gym', rating: 4.7, distance: '1.3 km', lat: 0, lng: 0 },
        { id: '155', name: 'Centro de Pesas', category: 'gym', rating: 4.6, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '156', name: 'Yoga & Pilates', category: 'gym', rating: 4.9, distance: '0.7 km', lat: 0, lng: 0 },
        { id: '157', name: 'Gym Premium', category: 'gym', rating: 4.7, distance: '1.1 km', lat: 0, lng: 0 },
        { id: '158', name: 'CrossFit Zone', category: 'gym', rating: 4.6, distance: '1.2 km', lat: 0, lng: 0 },
        { id: '159', name: 'Entrenamiento Personal', category: 'gym', rating: 4.8, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '160', name: 'Gimnasio 24h', category: 'gym', rating: 4.5, distance: '1.4 km', lat: 0, lng: 0 },
        { id: '161', name: 'Fitness & Wellness', category: 'gym', rating: 4.7, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '162', name: 'Centro de Boxeo', category: 'gym', rating: 4.6, distance: '1.0 km', lat: 0, lng: 0 },
        { id: '163', name: 'Spinning Studio', category: 'gym', rating: 4.8, distance: '0.7 km', lat: 0, lng: 0 },
        { id: '164', name: 'Zumba & Dance', category: 'gym', rating: 4.5, distance: '1.1 km', lat: 0, lng: 0 },
        { id: '165', name: 'Multiusos Fitness', category: 'gym', rating: 4.7, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '166', name: 'Iron Paradise', category: 'gym', rating: 4.9, distance: '1.5 km', lat: 0, lng: 0 },
        { id: '167', name: 'Functional Training', category: 'gym', rating: 4.8, distance: '0.6 km', lat: 0, lng: 0 },
        { id: '168', name: 'Martial Arts Dojo', category: 'gym', rating: 4.7, distance: '1.3 km', lat: 0, lng: 0 },
        { id: '169', name: 'Ladies Gym', category: 'gym', rating: 4.6, distance: '0.5 km', lat: 0, lng: 0 },
        { id: '170', name: 'Athletic Performance', category: 'gym', rating: 4.9, distance: '1.2 km', lat: 0, lng: 0 },
        { id: '171', name: 'Bootcamp Center', category: 'gym', rating: 4.8, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '172', name: 'Swim & Gym', category: 'gym', rating: 4.7, distance: '1.0 km', lat: 0, lng: 0 },
        { id: '173', name: 'Stretch Zone', category: 'gym', rating: 4.6, distance: '0.7 km', lat: 0, lng: 0 },
        { id: '174', name: 'Strong Body Gym', category: 'gym', rating: 4.8, distance: '1.4 km', lat: 0, lng: 0 },
        { id: '175', name: 'Fit Zone Pro', category: 'gym', rating: 4.9, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '176', name: 'Aerobics Studio', category: 'gym', rating: 4.5, distance: '1.1 km', lat: 0, lng: 0 },
        { id: '177', name: 'Muscle Factory', category: 'gym', rating: 4.7, distance: '0.6 km', lat: 0, lng: 0 },
        { id: '178', name: 'Wellness Center', category: 'gym', rating: 4.8, distance: '1.5 km', lat: 0, lng: 0 },
        { id: '179', name: 'Kickboxing Arena', category: 'gym', rating: 4.6, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '180', name: 'Total Fitness', category: 'gym', rating: 4.9, distance: '1.3 km', lat: 0, lng: 0 },
        { id: '181', name: 'Body Sculpt', category: 'gym', rating: 4.7, distance: '0.7 km', lat: 0, lng: 0 },
        { id: '182', name: 'Parkour Academy', category: 'gym', rating: 4.8, distance: '1.0 km', lat: 0, lng: 0 },
        { id: '183', name: 'Cycle Studio', category: 'gym', rating: 4.6, distance: '0.5 km', lat: 0, lng: 0 },
        { id: '184', name: 'Calisthenics Park', category: 'gym', rating: 4.9, distance: '1.2 km', lat: 0, lng: 0 },
        { id: '185', name: 'Barre & Ballet', category: 'gym', rating: 4.7, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '186', name: 'Urban Fitness', category: 'gym', rating: 4.8, distance: '1.4 km', lat: 0, lng: 0 },
        { id: '187', name: 'Strength Lab', category: 'gym', rating: 4.6, distance: '0.6 km', lat: 0, lng: 0 },
        { id: '188', name: 'Flex Gym', category: 'gym', rating: 4.5, distance: '1.1 km', lat: 0, lng: 0 },
        { id: '189', name: 'Core Training', category: 'gym', rating: 4.9, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '190', name: 'Victory Gym', category: 'gym', rating: 4.7, distance: '1.5 km', lat: 0, lng: 0 },
        { id: '191', name: 'HIIT Studio', category: 'gym', rating: 4.8, distance: '0.7 km', lat: 0, lng: 0 },
        { id: '192', name: 'Pole Fitness', category: 'gym', rating: 4.6, distance: '1.0 km', lat: 0, lng: 0 },
        { id: '193', name: 'Meditation & Gym', category: 'gym', rating: 4.9, distance: '0.5 km', lat: 0, lng: 0 },
        { id: '194', name: 'Champions Gym', category: 'gym', rating: 4.8, distance: '1.3 km', lat: 0, lng: 0 },
        { id: '195', name: 'TRX Training Center', category: 'gym', rating: 4.7, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '196', name: 'Senior Fitness', category: 'gym', rating: 4.6, distance: '1.2 km', lat: 0, lng: 0 },
        { id: '197', name: 'Speed & Agility', category: 'gym', rating: 4.9, distance: '0.6 km', lat: 0, lng: 0 },
        { id: '198', name: 'Balance Studio', category: 'gym', rating: 4.8, distance: '1.4 km', lat: 0, lng: 0 },
        { id: '199', name: 'Endurance Lab', category: 'gym', rating: 4.7, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '200', name: 'Fit Factory', category: 'gym', rating: 4.9, distance: '1.1 km', lat: 0, lng: 0 },

        // Salud (50)
        { id: '201', name: 'Farmacia Salud', category: 'health', rating: 4.5, distance: '1.5 km', lat: 0, lng: 0 },
        { id: '202', name: 'Clínica Premium', category: 'health', rating: 4.8, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '203', name: 'Farmacia Central', category: 'health', rating: 4.6, distance: '0.7 km', lat: 0, lng: 0 },
        { id: '204', name: 'Consultorio Médico', category: 'health', rating: 4.7, distance: '1.0 km', lat: 0, lng: 0 },
        { id: '205', name: 'Dentista Premium', category: 'health', rating: 4.9, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '206', name: 'Farmacia del Barrio', category: 'health', rating: 4.5, distance: '0.6 km', lat: 0, lng: 0 },
        { id: '207', name: 'Centro de Salud', category: 'health', rating: 4.6, distance: '1.2 km', lat: 0, lng: 0 },
        { id: '208', name: 'Oftalmología', category: 'health', rating: 4.8, distance: '1.1 km', lat: 0, lng: 0 },
        { id: '209', name: 'Fisioterapia Integral', category: 'health', rating: 4.7, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '210', name: 'Farmacia 24h', category: 'health', rating: 4.5, distance: '1.3 km', lat: 0, lng: 0 },
        { id: '211', name: 'Clínica Dental', category: 'health', rating: 4.8, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '212', name: 'Laboratorio Clínico', category: 'health', rating: 4.6, distance: '0.7 km', lat: 0, lng: 0 },
        { id: '213', name: 'Dermatología', category: 'health', rating: 4.7, distance: '1.0 km', lat: 0, lng: 0 },
        { id: '214', name: 'Farmacia Homeopática', category: 'health', rating: 4.5, distance: '1.2 km', lat: 0, lng: 0 },
        { id: '215', name: 'Centro Médico Completo', category: 'health', rating: 4.9, distance: '1.1 km', lat: 0, lng: 0 },
        { id: '216', name: 'Pediatría Especializada', category: 'health', rating: 4.8, distance: '0.6 km', lat: 0, lng: 0 },
        { id: '217', name: 'Cardiología Center', category: 'health', rating: 4.9, distance: '1.4 km', lat: 0, lng: 0 },
        { id: '218', name: 'Farmacia Natural', category: 'health', rating: 4.7, distance: '0.5 km', lat: 0, lng: 0 },
        { id: '219', name: 'Radiología Moderna', category: 'health', rating: 4.8, distance: '1.5 km', lat: 0, lng: 0 },
        { id: '220', name: 'Nutrición & Salud', category: 'health', rating: 4.6, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '221', name: 'Ginecología', category: 'health', rating: 4.9, distance: '1.0 km', lat: 0, lng: 0 },
        { id: '222', name: 'Farmacia Express', category: 'health', rating: 4.5, distance: '0.7 km', lat: 0, lng: 0 },
        { id: '223', name: 'Psicología Clínica', category: 'health', rating: 4.8, distance: '1.3 km', lat: 0, lng: 0 },
        { id: '224', name: 'Traumatología', category: 'health', rating: 4.7, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '225', name: 'Farmacia Veterinaria', category: 'health', rating: 4.6, distance: '1.2 km', lat: 0, lng: 0 },
        { id: '226', name: 'Urología Moderna', category: 'health', rating: 4.9, distance: '0.6 km', lat: 0, lng: 0 },
        { id: '227', name: 'Acupuntura Center', category: 'health', rating: 4.7, distance: '1.1 km', lat: 0, lng: 0 },
        { id: '228', name: 'Farmacia Comunitaria', category: 'health', rating: 4.5, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '229', name: 'Neurología Avanzada', category: 'health', rating: 4.9, distance: '1.4 km', lat: 0, lng: 0 },
        { id: '230', name: 'Quiropráctico Pro', category: 'health', rating: 4.8, distance: '0.7 km', lat: 0, lng: 0 },
        { id: '231', name: 'Farmacia Económica', category: 'health', rating: 4.6, distance: '1.5 km', lat: 0, lng: 0 },
        { id: '232', name: 'Otorrinolaringología', category: 'health', rating: 4.7, distance: '0.5 km', lat: 0, lng: 0 },
        { id: '233', name: 'Centro de Vacunación', category: 'health', rating: 4.8, distance: '1.0 km', lat: 0, lng: 0 },
        { id: '234', name: 'Farmacia Universitaria', category: 'health', rating: 4.5, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '235', name: 'Endocrinología', category: 'health', rating: 4.9, distance: '1.3 km', lat: 0, lng: 0 },
        { id: '236', name: 'Terapia Respiratoria', category: 'health', rating: 4.7, distance: '0.6 km', lat: 0, lng: 0 },
        { id: '237', name: 'Farmacia Popular', category: 'health', rating: 4.6, distance: '1.2 km', lat: 0, lng: 0 },
        { id: '238', name: 'Reumatología', category: 'health', rating: 4.8, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '239', name: 'Centro de Diálisis', category: 'health', rating: 4.9, distance: '1.1 km', lat: 0, lng: 0 },
        { id: '240', name: 'Farmacia del Doctor', category: 'health', rating: 4.5, distance: '0.7 km', lat: 0, lng: 0 },
        { id: '241', name: 'Alergología Center', category: 'health', rating: 4.8, distance: '1.4 km', lat: 0, lng: 0 },
        { id: '242', name: 'Masajes Terapéuticos', category: 'health', rating: 4.7, distance: '0.5 km', lat: 0, lng: 0 },
        { id: '243', name: 'Farmacia San Rafael', category: 'health', rating: 4.6, distance: '1.5 km', lat: 0, lng: 0 },
        { id: '244', name: 'Gastroenterología', category: 'health', rating: 4.9, distance: '0.9 km', lat: 0, lng: 0 },
        { id: '245', name: 'Centro de Imágenes', category: 'health', rating: 4.8, distance: '1.0 km', lat: 0, lng: 0 },
        { id: '246', name: 'Farmacia Moderna', category: 'health', rating: 4.7, distance: '0.6 km', lat: 0, lng: 0 },
        { id: '247', name: 'Hematología', category: 'health', rating: 4.9, distance: '1.3 km', lat: 0, lng: 0 },
        { id: '248', name: 'Medicina Alternativa', category: 'health', rating: 4.6, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '249', name: 'Farmacia Santa Fe', category: 'health', rating: 4.8, distance: '1.2 km', lat: 0, lng: 0 },
        { id: '250', name: 'Hospital General', category: 'health', rating: 4.9, distance: '1.1 km', lat: 0, lng: 0 },
    ], []);

    const filteredPlaces = selectedCategory && selectedCategory !== 'all'
        ? nearbyPlaces.filter(place => place.category === selectedCategory)
        : nearbyPlaces;

    const toggleBottomSheet = () => {
        const toValue = isExpanded ? 0 : 1;
        Animated.timing(bottomSheetAnim, {
            toValue,
            duration: 300,
            useNativeDriver: false,
        }).start();
        setIsExpanded(!isExpanded);
    };

    return (
        <View style={styles.container}>
            {/* Map Placeholder */}
            <View style={styles.mapContainer}>
                <Image
                    source={require('../assets/images/mapa.png')}
                    style={styles.mapImage}
                    resizeMode="cover"
                />


                {/* Floating Search Bar */}
                <View style={styles.floatingSearchContainer}>
                    <View style={styles.searchBar}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar lugares cercanos..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor="#888"
                        />
                    </View>
                </View>


                {/* Category Pills */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoryScrollView}
                    contentContainerStyle={styles.categoryContent}
                >
                    {categories.map((cat) => (
                        <Pressable
                            key={cat.id}
                            style={[
                                styles.categoryPill,
                                selectedCategory === cat.id && styles.categoryPillActive
                            ]}
                            onPress={() => setSelectedCategory(cat.id)}
                        >
                            <Text style={styles.categoryIcon}>{cat.icon}</Text>
                            <Text style={[
                                styles.categoryText,
                                selectedCategory === cat.id && styles.categoryTextActive
                            ]}>
                                {cat.name}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* Recenter Button */}
                <Pressable style={styles.recenterButton}>
                    <Text style={styles.recenterIcon}>📍</Text>
                </Pressable>
            </View>

            {/* Bottom Sheet with nearby places */}
            <Animated.View style={[styles.bottomSheet, {
                height: bottomSheetAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [80, height * 0.85],
                }),
            }]}>
                <Pressable onPress={toggleBottomSheet} style={styles.bottomSheetHeader}>
                    <Text style={styles.bottomSheetTitle}>Lugares cercanos</Text>
                    <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▲'}</Text>
                </Pressable>
                {isExpanded && (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.placesContent}
                    >
                        {filteredPlaces.map((place) => (
                            <Pressable key={place.id} style={styles.placeCard}>
                                <View style={styles.placeIcon}>
                                    <Text style={styles.placeIconText}>
                                        {place.category === 'restaurant' ? '🍽️' :
                                            place.category === 'cafe' ? '☕' :
                                                place.category === 'shop' ? '🛍️' :
                                                    place.category === 'gym' ? '💪' : '🏥'}
                                    </Text>
                                </View>
                                <View style={styles.placeInfo}>
                                    <Text style={styles.placeName}>{place.name}</Text>
                                    <View style={styles.placeDetails}>
                                        <Text style={styles.placeRating}>⭐ {place.rating}</Text>
                                        <Text style={styles.placeDistance}>📍 {place.distance}</Text>
                                    </View>
                                </View>
                                <Text style={styles.placeArrow}>›</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                )}
            </Animated.View>

            {/* Bottom Tab Bar */}
            <HomeTabBar activeRoute="/map" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    mapImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    mapOverlay: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    mapCityName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#9900ff',
    },
    floatingSearchContainer: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#333',
    },
    categoryScrollView: {
        position: 'absolute',
        top: 130,
        left: 0,
        right: 0,
    },
    categoryContent: {
        paddingHorizontal: 20,
        gap: 10,
    },
    categoryPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginRight: 10,
    },
    categoryPillActive: {
        backgroundColor: '#9900ff',
    },
    categoryIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    categoryText: {
        fontSize: 13,
        color: '#333',
        fontWeight: '500',
    },
    categoryTextActive: {
        color: '#fff',
    },
    recenterButton: {
        position: 'absolute',
        right: 20,
        bottom: 200,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 5,
    },
    recenterIcon: {
        fontSize: 24,
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
        overflow: 'hidden',
    },
    bottomSheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 12,
        paddingHorizontal: 20,
        paddingBottom: 12,
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.21)',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    bottomSheetHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#ddd',
        borderRadius: 2,
        position: 'absolute',
        top: 10,
        alignSelf: 'center',
    },
    bottomSheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginLeft: 16,
    },
    expandIcon: {
        fontSize: 16,
        color: '#9900ff',
        fontWeight: 'bold',
    },
    placesContent: {
        paddingBottom: 30,
        paddingHorizontal: 0,
    },
    placeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(240, 240, 240, 0.5)',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    placeIcon: {
        width: 45,
        height: 45,
        borderRadius: 12,
        backgroundColor: 'rgba(245, 240, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeIconText: {
        fontSize: 20,
    },
    placeInfo: {
        flex: 1,
        marginLeft: 12,
    },
    placeName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    placeDetails: {
        flexDirection: 'row',
        marginTop: 4,
    },
    placeRating: {
        fontSize: 12,
        color: '#666',
        marginRight: 12,
    },
    placeDistance: {
        fontSize: 12,
        color: '#999',
    },
    placeArrow: {
        fontSize: 24,
        color: '#ccc',
    },
});
