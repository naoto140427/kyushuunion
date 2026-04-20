"use client";

import React, { useState, useCallback, useRef } from "react";
import { useJsApiLoader, Autocomplete, DistanceMatrixService } from "@react-google-maps/api";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Coins } from "lucide-react";
import { cn, YUI_TRANSITION } from "../lib/utils";
import { YuiLoading } from "./YuiLoading";

const libraries: ("places")[] = ["places"];

interface LocationInputProps {
  onLocationCalculated: (data: { destination: string; distance: number; allowance: number } | null) => void;
}

export const LocationInput: React.FC<LocationInputProps> = ({ onLocationCalculated }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
    language: "ja",
  });

  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [destination, setDestination] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<{ distance: number; allowance: number } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const onLoad = useCallback((autocompleteObj: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteObj);
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        setDestination(place.name || place.formatted_address || "");
        calculateDistance(place.geometry.location);
      }
    }
  }, [autocomplete]);

  const calculateDistance = (destinationLocation: google.maps.LatLng) => {
    setIsCalculating(true);
    setResult(null);
    onLocationCalculated(null);

    const origin = "大分県大分市";

    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destinationLocation],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        setIsCalculating(false);
        if (status === google.maps.DistanceMatrixStatus.OK && response) {
          const element = response.rows[0].elements[0];
          if (element.status === google.maps.DistanceMatrixElementStatus.OK) {
            // value is in meters
            const distanceKm = element.distance.value / 1000;
            // Round trip
            const roundTripDistance = Math.round(distanceKm * 2 * 10) / 10;
            const allowance = Math.round(roundTripDistance * 25);

            setResult({ distance: roundTripDistance, allowance });
            onLocationCalculated({
              destination: destination || response.destinationAddresses[0] || "目的地",
              distance: roundTripDistance,
              allowance,
            });
          } else {
            console.error("Distance matrix element error:", element.status);
            alert("距離の計算に失敗しました。目的地を確認してください。");
          }
        } else {
          console.error("Distance matrix API error:", status);
          alert("経路検索APIのエラーが発生しました。");
        }
      }
    );
  };

  const handleClear = () => {
    setDestination("");
    setResult(null);
    onLocationCalculated(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  if (loadError) {
    return <div className="text-red-500 text-sm p-4 bg-red-50 rounded-[24px]">Google Maps APIの読み込みに失敗しました</div>;
  }

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-20 bg-white/50 backdrop-blur-md rounded-[32px] border border-white/40">
        <YuiLoading />
      </div>
    );
  }

  return (
    <div className="w-full bg-white/50 backdrop-blur-md rounded-[32px] border border-white/40 shadow-[0_4px_20px_rgb(0,0,0,0.02)] p-6">
      <div className="mb-4 flex items-center gap-2 text-slate-700">
        <MapPin size={20} className="text-pink-400" />
        <h3 className="text-sm font-bold">目的地を検索</h3>
      </div>

      <div className="relative mb-6">
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged} options={{
          componentRestrictions: { country: "jp" },
          fields: ["geometry", "name", "formatted_address"]
        }}>
          <input
            type="text"
            placeholder="施設名や住所を入力..."
            ref={inputRef}
            className="w-full bg-white/70 border-2 border-white/60 focus:border-pink-300 focus:bg-white text-slate-700 text-sm rounded-[24px] py-4 px-5 shadow-inner transition-all outline-none"
          />
        </Autocomplete>
        {destination && !isCalculating && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-6 h-6 flex items-center justify-center text-xs"
          >
            ✕
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isCalculating ? (
          <motion.div
            key="calculating"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={YUI_TRANSITION}
            className="flex flex-col items-center justify-center py-4"
          >
            <YuiLoading />
            <p className="text-xs text-slate-400 mt-2 font-medium">距離を計算中...</p>
          </motion.div>
        ) : result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={YUI_TRANSITION}
            className="bg-white/80 border border-white/50 rounded-[28px] p-5 shadow-sm space-y-4 relative overflow-hidden"
          >
             <div className="absolute top-0 left-0 w-1.5 h-full bg-pink-400 rounded-l-full" />

             <div>
               <p className="text-[10px] font-bold text-pink-400 uppercase tracking-wider mb-1">Destination</p>
               <p className="text-sm font-bold text-slate-700 leading-snug">{destination}</p>
             </div>

             <div className="h-px w-full bg-slate-100" />

             <div className="grid grid-cols-2 gap-4">
               <div>
                 <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                   <Navigation size={14} />
                   <span className="text-[10px] font-bold tracking-wider">往復距離</span>
                 </div>
                 <p className="text-xl font-black text-slate-800">
                   {result.distance} <span className="text-xs font-bold text-slate-500">km</span>
                 </p>
               </div>

               <div>
                 <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                   <Coins size={14} />
                   <span className="text-[10px] font-bold tracking-wider">自家用車代</span>
                 </div>
                 <p className="text-xl font-black text-pink-500">
                   ¥{result.allowance.toLocaleString()}
                 </p>
               </div>
             </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
