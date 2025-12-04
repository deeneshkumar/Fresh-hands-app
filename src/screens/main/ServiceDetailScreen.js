import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import Button from '../../components/Button';

export default function ServiceDetailScreen({ route, navigation }) {
    const { service } = route.params;

    // Dummy sub-services
    const subServices = [
        { id: '1', name: `Basic ${service.name}`, price: service.price, time: '30 mins' },
        { id: '2', name: `Deep ${service.name}`, price: parseInt(service.price) * 2, time: '60 mins' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.imageContainer}>
                    {service.image ? (
                        <Image source={{ uri: service.image }} style={styles.image} resizeMode="cover" />
                    ) : (
                        <View style={styles.placeholderImage} />
                    )}
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <ArrowLeft color={COLORS.white} size={24} />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>{service.name}</Text>
                        <View style={styles.ratingBadge}>
                            <Star size={14} color={COLORS.white} fill={COLORS.white} />
                            <Text style={styles.ratingText}>{service.rating}</Text>
                        </View>
                    </View>
                    <Text style={styles.price}>Starts at ₹{service.price}</Text>

                    <Text style={styles.sectionTitle}>Select a Service</Text>
                    {subServices.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <View>
                                <Text style={styles.serviceName}>{item.name}</Text>
                                <Text style={styles.serviceMeta}>{item.time} • ₹{item.price}</Text>
                            </View>
                            <Button
                                title="Add"
                                style={styles.addButton}
                                onPress={() => navigation.navigate('Booking', { service: item })}
                            />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        paddingBottom: THEME.spacing.xl,
    },
    imageContainer: {
        height: 250,
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.textLight,
    },
    backButton: {
        position: 'absolute',
        top: THEME.spacing.m,
        left: THEME.spacing.m,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        padding: 8,
    },
    content: {
        padding: THEME.spacing.m,
        marginTop: -20,
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        flex: 1,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.success,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    ratingText: {
        color: COLORS.white,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    price: {
        fontSize: 18,
        color: COLORS.primary,
        fontWeight: 'bold',
        marginBottom: THEME.spacing.l,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: THEME.spacing.m,
        color: COLORS.text,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: THEME.spacing.m,
        borderRadius: THEME.borderRadius.m,
        marginBottom: THEME.spacing.m,
        elevation: 2,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    serviceMeta: {
        color: COLORS.textLight,
    },
    addButton: {
        width: 80,
        paddingVertical: 8,
    },
});
