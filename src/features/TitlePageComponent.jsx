import {useEffect, useMemo, useState} from "react";
import {
    Star,
    ListPlus,
    Pencil,
    Trash2,
    ThumbsUp
} from "lucide-react";
import {toast} from "sonner";

// Independent UI pieces
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Slider} from "@/components/ui/slider";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter} from "@/components/ui/dialog";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import MovieCard from "@/components/cutomeUI/MovieCard.jsx";

import {
    MOCK_SIMILAR_TITLES,
    MOCK_SEASON_DATA,
} from "@/features/data/index.js"

/* ==========================================
   INTERNAL RATING PILL COMPONENT
   ========================================== */
export function RatingBubble({label, value, max}) {
    return (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
            <Star className="h-4 w-4 fill-primary text-primary"/>
            <div>
                <div className="text-sm font-semibold leading-none">{value}{max}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
            </div>
        </div>
    );
}

/* ==========================================
   INTERNAL TEXT LIST VALUE PARSER
   ========================================== */
export function CrewLine({label, value}) {
    if (!value || value === "N/A") return null;
    return (
        <div className="grid grid-cols-[120px,1fr] gap-3 text-sm">
            <div className="text-muted-foreground font-medium">{label}</div>
            <div className="text-foreground">{value}</div>
        </div>
    );
}

/* ==========================================
   SEASONS EPISODIC LIST CONTAINER
   ========================================== */
export function SeasonsTab({totalSeasons}) {
    const [season, setSeason] = useState(1);

    return (
        <div className="space-y-4">
            <Select value={String(season)} onValueChange={(v) => setSeason(Number(v))}>
                <SelectTrigger className="w-[160px]"><SelectValue/></SelectTrigger>
                <SelectContent>
                    {Array.from({length: totalSeasons}).map((_, i) => (
                        <SelectItem key={i} value={String(i + 1)}>Season {i + 1}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <div className="divide-y divide-border rounded-lg border border-border bg-card">
                {MOCK_SEASON_DATA.Episodes.map((e) => (
                    <div key={e.imdbID} className="flex items-center gap-4 p-3">
                        <div
                            className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-muted text-sm font-semibold">{e.Episode}</div>
                        <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">{e.Title}</div>
                            <div className="text-xs text-muted-foreground">{e.Released}</div>
                        </div>
                        {e.imdbRating && e.imdbRating !== "N/A" && (
                            <div className="inline-flex items-center gap-1 text-sm font-medium">
                                <Star className="h-3.5 w-3.5 fill-primary text-primary"/> {e.imdbRating}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}