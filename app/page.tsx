'use client'

import Search from "./components/Search";
import LocationDetailPanel from "./components/LocationDetailPanel";
import ResultList from "./components/ResultList";
import { useLocationStore } from "./store/location";
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import { getLocations } from "./api/locations";
import { useAuthProtection } from "./hooks/useAuthProtection";

export default function Home() {
  useAuthProtection();

  const {
    selectedLocation,
    setSelectedLocation,
    showNearbySearch,
    exitNearbyMode,
    anchorLocation,
  } = useLocationStore();

  const MapCard = useMemo(() => dynamic(
    () => import('./components/MapCard'),
    { ssr: false }
  ), []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const offices = await getLocations();
        useLocationStore.getState().setLocations(offices);
      } catch (error) {
        console.error('Error fetching offices:', error);
      }
    };
    fetchData();
  }, []);

  const detailLocation = selectedLocation ?? (showNearbySearch ? anchorLocation : null);
  const detailPanelOpen = !!detailLocation;

  const handleCloseDetail = () => {
    if (showNearbySearch && selectedLocation?.id !== anchorLocation?.id) {
      setSelectedLocation(anchorLocation);
    } else if (showNearbySearch) {
      exitNearbyMode();
    } else {
      setSelectedLocation(null);
    }
  };

  const mobileSheetOpen = !!selectedLocation || showNearbySearch;

  const handleCloseMobileSheet = () => {
    exitNearbyMode();
    setSelectedLocation(null);
  };

  return (
    <>
      <main className="flex flex-col h-screen pt-16 bg-[#E4E9F1]">
        <div className="p-2 md:p-4 lg:pb-0 lg:p-6">
          <Search />
        </div>

        <LayoutGroup>
          <div className="flex flex-col md:flex-row flex-1 gap-4 p-2 md:p-4 lg:p-6 md:overflow-hidden">
            <div className="hidden md:flex flex-col shrink-0" style={{ width: 300 }}>
              <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
                <ResultList />
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
              {detailPanelOpen && (
                <motion.div
                  key="desktop-panel"
                  initial={{ width: 0 }}
                  animate={{ width: 320 }}
                  exit={{ width: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  style={{ flexShrink: 0, overflow: 'hidden' }}
                  className="hidden md:flex flex-col"
                >
                  <motion.div
                    initial={{ x: 320 }}
                    animate={{ x: 0 }}
                    exit={{ x: 320 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    style={{ width: 320 }}
                    className="flex flex-col h-full"
                  >
                    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
                      <LocationDetailPanel
                        location={detailLocation}
                        onClose={handleCloseDetail}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </LayoutGroup>
      </main>

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {mobileSheetOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden fixed inset-0 z-998 bg-black/30"
              onClick={handleCloseMobileSheet}
            />

            <motion.div
              key="mobile-modal"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-9999 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-2 flex justify-center rounded-t-3xl">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>
              <LocationDetailPanel
                location={detailLocation}
                onClose={handleCloseDetail}
                isMobileModal={true}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}