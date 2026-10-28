import {useEffect} from "react";
import {Flame, Sparkles, Trophy, Tv} from "lucide-react";

import Section from "@/components/Layouts/Section.jsx";
import MovieRail from "#src/components/cutomeUI/MovieRail.jsx";

// import {useSearchMovies} from "#src/hooks/cmdb/useSearch.js";

import {TRENDING_IDS, POPULAR_IDS, TOP_RATED_IDS, TOP_TV_IDS} from "#/src/lib/home-data.js"


function Home() {
    useEffect(() => {
        document.title = "OMDb+ — Discover movies and TV";
    }, []);

    /* const {
        data,
        isLoading,
        error,
    } = useSearchMovies("game of thrones", 1, "", "2022");

    if (isLoading) return <span>Loading...</span>;

    if (error) return <span>{error}</span>;

    console.log(data) */

    return (
        <>
            {/* Hero Header Section */}
            <section
                className="container-page mt-8 mb-12 rounded-2xl border border-border bg-gradient-to-br from-primary/15 via-background to-background p-8 md:p-12">
                <div className="max-w-2xl">
                    <div
                        className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                        <Sparkles className="h-3 w-3 text-primary"/>
                        Your personal movie journal
                    </div>
                    <h1 className="text-balance font-display text-4xl font-bold tracking-tight md:text-6xl">
                        Track every film and series that shaped you.
                    </h1>
                    <p className="mt-4 max-w-xl text-balance text-muted-foreground md:text-lg">
                        Rate, review, and save your favorite movies and shows. Build your personal watchlist and keep
                        track of what you love.
                    </p>
                </div>
            </section>

            {/* Main Rows Layout */}
            <div className="container-page space-y-12 pb-16">
                <Section
                    title="Trending now"
                    subtitle={<span className="inline-flex items-center gap-1"><Flame className="h-3 w-3"/> Curated for you</span>}
                >
                    <MovieRail items={TRENDING_IDS}/>
                </Section>

                <Section
                    title="Popular"
                    subtitle="What everyone is watching"
                >
                    <MovieRail items={POPULAR_IDS}/>
                </Section>

                <Section
                    title="Top TV"
                    subtitle={<span className="inline-flex items-center gap-1"><Tv className="h-3 w-3"/> Critically acclaimed series</span>}
                >
                    <MovieRail items={TOP_TV_IDS}/>
                </Section>

                <Section
                    title="Top rated"
                    subtitle={<span className="inline-flex items-center gap-1"><Trophy className="h-3 w-3"/> The all-time greats</span>}
                >
                    <MovieRail items={TOP_RATED_IDS}/>
                </Section>
            </div>
        </>
    );
}

export default Home;