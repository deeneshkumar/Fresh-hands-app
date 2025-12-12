import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tag, Copy, ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';

const VOUCHERS = [
    { id: '1', code: 'WELCOME50', description: '50% off on first order', expiry: 'Valid till 31 Dec' },
    { id: '2', code: 'FRESH20', description: '20% off on cleaning', expiry: 'Valid till 15 Jan' },
];

export default function VouchersScreen() {
    const navigation = useNavigation();

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.left}>
                <Tag color={COLORS.primary} size={24} />
                <View style={styles.info}>
                    <Text style={styles.code}>{item.code}</Text>
                    <Text style={styles.desc}>{item.description}</Text>
                    <Text style={styles.expiry}>{item.expiry}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.copyButton}>
                <Copy color={COLORS.primary} size={20} />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft color={COLORS.text} size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>My Vouchers</Text>
                <View style={{ width: 24 }} />
            </View>
            <FlatList
                data={VOUCHERS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>No vouchers available</Text>}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: THEME.spacing.m,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    list: {
        padding: THEME.spacing.m,
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
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    info: {
        marginLeft: THEME.spacing.m,
    },
    code: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    desc: {
        color: COLORS.textLight,
        fontSize: 14,
        marginTop: 2,
    },
    expiry: {
        color: COLORS.textLight,
        fontSize: 12,
        marginTop: 4,
        fontStyle: 'italic',
    },
    copyButton: {
        padding: 8,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: COLORS.textLight,
    },
});
