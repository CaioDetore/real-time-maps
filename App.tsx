import React, { useState, useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";

import { View } from "react-native";
import {
  LocationObject,
  LocationAccuracy,
  watchPositionAsync,
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from "expo-location";

import * as S from "./styles";

export default function App() {
  const [location, setLocation] = useState<LocationObject | null>();

  const mapRef = useRef<MapView>(null)

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
    }
  }

  useEffect(() => {
    requestLocationPermissions();
  }, []);

  useEffect(() => {
    watchPositionAsync({
      timeInterval: 1000,
      distanceInterval: 1,
      accuracy: LocationAccuracy.Highest
    }, (response) => {
      setLocation(response)
      mapRef.current?.animateCamera({
        pitch: 70,
        center: response.coords
      })
    })
  }, [])

  return (
    <View style={S.styles.container}>
      {location && (
        <MapView
          ref={mapRef}
          style={S.styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          />
        </MapView>
      )}
    </View>
  );
}
