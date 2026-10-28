import {useEffect, useMemo, useState} from "react";
import {Search as SearchIcon, Filter, CircleX, SearchX} from "lucide-react";

import MovieCardSkeleton from "@/components/cutomeUI/MovieCardSkeleton.jsx";
import EmptyState from "@/components/cutomeUI/EmptyState.jsx";
import PageHeader from "@/components/Layouts/PageHeader.jsx";
import MovieCard from "@/components/cutomeUI/MovieCard.jsx";

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

import {useSearchMovies} from "@/hooks/cmdb/useSearch.js";

function Search() {
    useEffect(() => {
        document.title = "Search · OMDb+";
    }, []);

    const [q, setQ] = useState("");
    const [debounced, setDebounced] = useState("");

    const [type, setType] = useState("all");
    const [year, setYear] = useState("any");
    const [visibleCount, setVisibleCount] = useState(5);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounced(q.trim());
            setVisibleCount(5);
        }, 400);

        return () => clearTimeout(timer);
    }, [q]);

    const yearDropdownOptions = useMemo(() => {
        const years = [];
        const currentYear = new Date().getFullYear();

        for (let y = currentYear; y >= 1970; y--) {
            years.push(String(y));
        }

        return years;
    }, []);

    const {
        data,
        isLoading,
        error,
    } = useSearchMovies(
        debounced,
        1,
        type === "all" ? "" : type,
        year === "any" ? "" : year
    );

    const results = data?.Search ?? [];

    const pagedResults = results.slice(0, visibleCount);

    const hasNextPage = results.length > visibleCount;

    return (
        <div className="container-page mt-8 pb-16">
            <PageHeader
                title="Search the catalogue"
                subtitle="Find any movie or series indexed by OMDb."
            />

            <div className="rounded-xl border border-border bg-card p-4 md:p-6">
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>

                    <Input
                        autoFocus
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search 'Inception', 'Batman', 'Sherlock'..."
                        className="h-12 pl-10 text-base"
                    />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Filter className="h-4 w-4"/>
                        Filters
                    </div>

                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue/>
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">All types</SelectItem>
                            <SelectItem value="movie">Movies</SelectItem>
                            <SelectItem value="series">TV Series</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={year} onValueChange={setYear}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue/>
                        </SelectTrigger>

                        <SelectContent className="max-h-72">
                            <SelectItem value="any">Any year</SelectItem>

                            {yearDropdownOptions.map((y) => (
                                <SelectItem key={y} value={y}>
                                    {y}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="mt-8">
                {debounced.length < 3 ? (
                    <EmptyState
                        icon={<SearchIcon className="h-8 w-8"/>}
                        title="Start typing to search"
                        description="Type at least 2 characters."
                    />
                ) : isLoading ? (
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {Array.from({length: 5}).map((_, i) => (
                            <MovieCardSkeleton key={i}/>
                        ))}
                    </div>
                ) : error ? (
                    <EmptyState
                        icon={<CircleX className="h-8 w-8"/>}
                        title="Something went wrong"
                        description={error.message}
                    />
                ) : pagedResults.length === 0 ? (
                    <EmptyState
                        icon={<SearchX className="h-8 w-8"/>}
                        title="No results"
                        description="Try another search."
                    />
                ) : (
                    <>
                        <div className="mb-4 text-sm text-muted-foreground">
                            {data.totalResults} results
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {pagedResults.map((movie) => (
                                <MovieCard
                                    key={movie.imdbID}
                                    omdbId={movie.imdbID}
                                    className={"w-full"}
                                />
                            ))}
                        </div>

                        {hasNextPage && (
                            <div className="mt-8 flex justify-center">
                                <Button
                                    onClick={() =>
                                        setVisibleCount((prev) => prev + 5)
                                    }
                                >
                                    Load more
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Search;