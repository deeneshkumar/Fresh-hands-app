import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/theme';
import { PersonStanding, MapPin } from 'lucide-react-native';

const USER_LOCATION = {
    latitude: 12.9716,
    longitude: 77.5946,
    latitudeDelta: 0.02, // Zoomed in a bit more
    longitudeDelta: 0.02,
};

const DRIVER_START = {
    latitude: 12.9616, // Closer start for demo
    longitude: 77.5846,
};

// Bright/Clean Map Style (White/Grey/Black)
const customMapStyle = [
    {
        "elementType": "geometry",
        "stylers": [{ "color": "#f5f5f5" }] // Light grey background
    },
    {
        "elementType": "labels.icon",
        "stylers": [{ "visibility": "off" }] // Hide icons
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#616161" }]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#f5f5f5" }]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#bdbdbd" }]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{ "color": "#eeeeee" }]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{ "color": "#e5e5e5" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#9e9e9e" }]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{ "color": "#ffffff" }] // White roads
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{ "color": "#dadada" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#616161" }]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#9e9e9e" }]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [{ "color": "#e5e5e5" }]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [{ "color": "#eeeeee" }]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#c9c9c9" }] // Greyscale water
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#9e9e9e" }]
    }
];

// Calculate distance between two coords in km
const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const deg2rad = (deg) => deg * (Math.PI / 180);

export default function LiveTrackingMap({ style, onArrived }) {
    const mapRef = useRef(null);
    const [driverLocation, setDriverLocation] = useState(DRIVER_START);
    const [eta, setEta] = useState(10);
    const [distance, setDistance] = useState(2.0);
    const hasArrived = useRef(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (hasArrived.current) {
                clearInterval(interval);
                return;
            }

            setDriverLocation(prev => {
                const latDiff = USER_LOCATION.latitude - prev.latitude;
                const lonDiff = USER_LOCATION.longitude - prev.longitude;

                // Check arrival (within ~50m)
                if (Math.abs(latDiff) < 0.0005 && Math.abs(lonDiff) < 0.0005) {
                    hasArrived.current = true;
                    if (onArrived) onArrived();
                    return USER_LOCATION; // Snap to user
                }

                const newLat = prev.latitude + latDiff * 0.03; // Slightly faster
                const newLon = prev.longitude + lonDiff * 0.03;

                const dist = getDistance(newLat, newLon, USER_LOCATION.latitude, USER_LOCATION.longitude);
                setDistance(dist.toFixed(1));
                setEta(Math.ceil(dist * 5));

                return { latitude: newLat, longitude: newLon };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Fit to markers on mount
    useEffect(() => {
        if (mapRef.current) {
            setTimeout(() => {
                mapRef.current.fitToCoordinates([USER_LOCATION, DRIVER_START], {
                    edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                    animated: true,
                });
            }, 500);
        }
    }, []);

    return (
        <View style={[styles.container, style]}>
            <View style={styles.mapWrapper}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    customMapStyle={customMapStyle}
                    initialRegion={USER_LOCATION}
                    showsUserLocation={false}
                    scrollEnabled={true}
                    zoomEnabled={true}
                >
                    {/* User Marker */}
                    <Marker coordinate={USER_LOCATION} title="You">
                        <View style={styles.markerContainer}>
                            <MapPin color="black" size={32} fill={COLORS.white} />
                        </View>
                    </Marker>

                    {/* Agent Marker */}
                    <Marker coordinate={driverLocation} title="Agent">
                        <View style={styles.markerContainer}>
                            <PersonStanding color="black" size={32} fill={COLORS.warning} />
                        </View>
                    </Marker>

                    {/* Route */}
                    <Polyline
                        coordinates={[USER_LOCATION, driverLocation]}
                        strokeColor="black"
                        strokeWidth={3}
                        lineDashPattern={[5, 5]}
                    />
                </MapView>
            </View>

            {/* Separate Stats Box */}
            <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Distance</Text>
                    <Text style={styles.statValue}>{distance} km</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Time</Text>
                    <Text style={styles.statValue}>{eta} min</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        borderRadius: THEME.borderRadius.l,
        backgroundColor: COLORS.white,
        position: 'relative',
        marginBottom: 20,
        marginTop: 10,
        borderWidth: 2,
        borderColor: '#333333', // Dark grey border
    },
    mapWrapper: {
        flex: 1, // Takes available space
        borderTopLeftRadius: THEME.borderRadius.l,
        borderTopRightRadius: THEME.borderRadius.l,
        overflow: 'hidden',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsContainer: {
        backgroundColor: COLORS.white,
        paddingVertical: 15,
        paddingHorizontal: 12,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderBottomLeftRadius: THEME.borderRadius.l,
        borderBottomRightRadius: THEME.borderRadius.l,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        elevation: 2, // Subtle shadow for separation
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    statBox: {
        alignItems: 'center',
    },
    divider: {
        width: 1,
        height: '60%',
        backgroundColor: COLORS.border,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: 4,
        fontWeight: '600',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    }
});
