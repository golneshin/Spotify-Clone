import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";

import TopBar from "@/components/TopBar";
import SectionGrid from "./home-components/SectionGrid";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlayerStore } from "@/stores/usePlayerStore";
import FeaturedSection from "./home-components/FeaturedSection";

const HomePage = () => {
  const {
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
    isLoading,
    madeForYouSongs,
    featuredSongs,
    trendingSongs,
  } = useMusicStore();

  console.log(madeForYouSongs, featuredSongs, trendingSongs);

  const { initializeQueue } = usePlayerStore();

  useEffect(() => {
    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
  }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

  useEffect(() => {
    if (
      madeForYouSongs.length > 0 &&
      featuredSongs.length > 0 &&
      trendingSongs.length > 0
    ) {
      const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
      initializeQueue(allSongs);
    }
  }, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

  return (
    <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
      <TopBar />
      <div className="h-full">
        <ScrollArea className="h-full rounded-md">
          <div className=" h-full p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">
              Good afternoon
            </h1>
            <FeaturedSection />

            <div className="space-y-8">
              <SectionGrid
                title="Made For You"
                songs={madeForYouSongs}
                isLoading={isLoading}
              />
              <SectionGrid
                title="Trending"
                songs={trendingSongs}
                isLoading={isLoading}
              />
            </div>
          </div>
        </ScrollArea>
      </div>
    </main>
  );
};

export default HomePage;
