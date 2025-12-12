import React from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Category, SubCategory } from '../types/home.types';

interface SubcategoriesModalProps {
    visible: boolean;
    category: Category | null;
    onClose: () => void;
    onSubcategoryPress?: (subcategory: SubCategory) => void;
}

export default function SubcategoriesModal({
    visible,
    category,
    onClose,
    onSubcategoryPress,
}: SubcategoriesModalProps) {
    if (!category) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <Pressable style={styles.backdrop} onPress={onClose} />

                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{category.name}</Text>
                        <Pressable onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </Pressable>
                    </View>

                    {/* Subcategorías */}
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                    >
                        {category.subcategories && category.subcategories.length > 0 ? (
                            <View style={styles.subcategoriesGrid}>
                                {category.subcategories.map((subcategory) => (
                                    <Pressable
                                        key={subcategory.id}
                                        style={styles.subcategoryCard}
                                        onPress={() => {
                                            onSubcategoryPress?.(subcategory);
                                            onClose();
                                        }}
                                        android_ripple={{ color: 'rgba(153, 0, 255, 0.1)' }}
                                    >
                                        {subcategory.icon && (
                                            <Text style={styles.subcategoryIcon}>
                                                {subcategory.icon}
                                            </Text>
                                        )}
                                        <Text style={styles.subcategoryName}>
                                            {subcategory.name}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyStateText}>
                                    No hay subcategorías disponibles
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 20,
        paddingHorizontal: 20,
        maxHeight: '70%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 20,
        color: '#666',
        fontWeight: 'bold',
    },
    scrollView: {
        marginBottom: 20,
    },
    subcategoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    subcategoryCard: {
        width: '47%',
        backgroundColor: '#f8f8f8',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 100,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    subcategoryIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    subcategoryName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 14,
        color: '#999',
    },
});
