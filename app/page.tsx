'use client'

import Filters from "./components/Filters";
import Search from "./components/Search";
import LocationDetailPanel from "./components/LocationDetailPanel";
import ResultList from "./components/ResultList";
import { useLocationStore } from "./store/location";
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import NearbySearch from "./components/NearbySearch";
import dynamic from "next/dynamic";
import { useMemo } from "react";

export default function Home() {
  const { selectedLocation, setSelectedLocation, showNearbySearch } = useLocationStore();
  const MapCard = useMemo(() => dynamic(
    () => import('./components/MapCard'),
    {
      loading: () => <p>Map loading...</p>,
      ssr: false
    }
  ), []);

  return (
    <>
      <main className="flex flex-col h-screen pt-16 bg-[#E4E9F1]">
        <div className="bg-white flex flex-col gap-4 rounded-xl shadow-md p-4 md:p-6 m-2 md:m-4 lg:m-6">
          <Search />
          <Filters />
        </div>

        <LayoutGroup>
          <div className="flex flex-col md:flex-row flex-1 gap-4 p-2 md:p-4 lg:p-6 md:overflow-hidden">
            <div className="hidden md:flex flex-col shrink-0" style={{ width: 288 }}>
              <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
                {showNearbySearch ? (
                  <NearbySearch />
                ) : (
                  <ResultList />
                )}
              </div>
            </div>

            <motion.div
              className="flex-1 p-6 bg-white rounded-xl shadow-md overflow-hidden"
              layout
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <MapCard />
            </motion.div>

            <AnimatePresence>
              {selectedLocation && (
                <motion.div
                  key="desktop-panel"
                  initial={{ width: 0 }}
                  animate={{ width: 384 }}
                  exit={{ width: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  style={{ flexShrink: 0, overflow: 'hidden' }}
                  className="hidden md:flex flex-col"
                >
                  <motion.div
                    initial={{ x: 384 }}
                    animate={{ x: 0 }}
                    exit={{ x: 384 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    style={{ width: 384 }}
                    className="flex flex-col h-full"
                  >
                    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
                      <LocationDetailPanel
                        location={selectedLocation}
                        onClose={() => setSelectedLocation(null)}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      </main>

      <AnimatePresence>
        {selectedLocation && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden fixed bottom-0 left-0 right-0 top-0 z-40 bg-black/30"
              onClick={() => setSelectedLocation(null)}
            />

            <motion.div
              key="mobile-modal"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-2 flex justify-center rounded-t-3xl">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>
              <LocationDetailPanel
                location={selectedLocation}
                onClose={() => setSelectedLocation(null)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
