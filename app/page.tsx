'use client'
import LocationDetailPanel from "./components/LocationDetailPanel";
import ResultList from "./components/ResultList";
import { useLocationStore } from "./store/location";
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { getLocations } from "./api/locations";
import { useAuthProtection } from "./hooks/useAuthProtection";
import { X } from 'lucide-react';
import { LOCATION_TYPE_CONFIG } from "./utils/locationTypes";

export default function Home() {
  const isAuthenticated = useAuthProtection();

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
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const offices = await getLocations();
        useLocationStore.getState().setLocations(offices);
      } catch (error) {
        console.error('Error fetching offices:', error);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  const detailLocation = selectedLocation ?? (showNearbySearch ? anchorLocation : null);
  const detailPanelOpen = !!detailLocation;

  const handleCloseDetail = () => {
    if (showNearbySearch && selectedLocation?.id !== anchorLocation?.id) {
      setSelectedLocation(anchorLocation);
    } else if (showNearbySearch) {
      exitNearbyMode();
      setSelectedLocation(null);
    } else {
      setSelectedLocation(null);
    }
  };

  const [mobileSheetSnap, setMobileSheetSnap] = useState<'peek' | 'full'>('full');
  const PEEK_HEIGHT = 60;
  const NAV_MARGIN_HEIGHT = 250;
  const SHEET_HEIGHT = `calc(100vh - ${NAV_MARGIN_HEIGHT}px)`;

  const mobileSheetOpen = !!selectedLocation || showNearbySearch;


  useEffect(() => {
    if (mobileSheetOpen) setMobileSheetSnap('full');
  }, [mobileSheetOpen]);

  useEffect(() => {
    if (selectedLocation) setMobileSheetSnap('full');
  }, [selectedLocation]);

  const handleMobileExit = () => {
    exitNearbyMode();
    setSelectedLocation(null);
  };

  return (
    <>
      <main className="flex flex-col h-screen pt-16 bg-[#E4E9F1]">
        <LayoutGroup>
          <div className="flex flex-col md:flex-row flex-1 gap-4 p-2 md:p-4 lg:p-6 md:overflow-hidden">
            <div className="hidden md:flex flex-col shrink-0" style={{ width: 300 }}>
              <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
                <ResultList />
              </div>
            </div>

            <motion.div
              className="flex-1 bg-white rounded-xl shadow-md overflow-hidden"
              layout
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <div className="flex h-full">
                <div className="flex-1 p-6 overflow-hidden">
                  <MapCard />
                </div>

                <AnimatePresence>
                  {detailPanelOpen && (
                    <motion.div
                      key="desktop-panel"
                      initial={{ width: 0 }}
                      animate={{ width: 320 }}
                      exit={{ width: 0 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      style={{ flexShrink: 0, overflow: 'hidden' }}
                      className="hidden md:block"
                    >
                      <motion.div
                        initial={{ x: 320 }}
                        animate={{ x: 0 }}
                        exit={{ x: 320 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        style={{ width: 320 }}
                        className="flex flex-col h-full"
                      >
                        <LocationDetailPanel
                          location={detailLocation}
                          onClose={handleCloseDetail}
                        />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

          </div>
        </LayoutGroup>
      </main>

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {mobileSheetOpen && detailLocation && (
          <motion.div
            key="mobile-sheet"
            initial={{ y: '100%' }}
            animate={{ y: mobileSheetSnap === 'peek' ? `calc(100% - ${PEEK_HEIGHT}px)` : '0px' }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.08}
            onDragEnd={(_, info) => {
              if (info.velocity.y > 300 || info.offset.y > 120) {
                setMobileSheetSnap('peek');
              } else if (info.velocity.y < -300 || info.offset.y < -120) {
                setMobileSheetSnap('full');
              } else {
                setMobileSheetSnap(prev => prev);
              }
            }}
            className="md:hidden fixed inset-x-0 top-0 z-9999 bg-white rounded-t-3xl shadow-2xl"
            style={{ height: SHEET_HEIGHT, touchAction: 'none', top: NAV_MARGIN_HEIGHT }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`bg-white border-b border-gray-200 px-4 ${mobileSheetSnap === 'full' ? 'pt-0' : 'py-2'} rounded-t-3xl flex flex-col justify-around`}
              style={{ height: PEEK_HEIGHT }}
              onClick={() => setMobileSheetSnap(p => p === 'peek' ? 'full' : 'peek')}
            >
              <div className="flex justify-center mb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {LOCATION_TYPE_CONFIG[detailLocation.type].icon('w-6 h-6 text-[#041E42]')}
                  <h2 className="uppercase text-md font-semibold text-gray-900">
                    {detailLocation.name}
                  </h2>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleMobileExit(); }}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors ml-2 shrink-0"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div style={{ height: `calc(${SHEET_HEIGHT} - ${PEEK_HEIGHT}px)`, overflow: 'hidden' }} >
              <LocationDetailPanel
                location={detailLocation}
                onClose={handleCloseDetail}
                isMobileModal={true}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}