import {Link} from "react-router-dom";
import {X, MoveUp, MoveDown} from "lucide-react";

/* ==========================================
   STANDARD STATIC TILE VIEW
   ========================================== */

export function Tile({item}) {
    return (
        <Link to={`/title/${item.imdbID}`} className="block group">
            <div className="aspect-[2/3] overflow-hidden rounded-lg bg-muted ring-1 ring-border">
                {item.Poster && <img src={item.Poster} alt={item.Title}
                                     className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"/>}
            </div>
            <div
                className="mt-2 line-clamp-2 text-sm font-medium leading-tight group-hover:text-primary transition-colors">{item.Title}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{item.Year}</div>
        </Link>
    );
}

/* ==========================================
   INTERACTIVE REORDER/REMOVE MANAGE TILE
   ========================================== */
export function InteractiveTile({item, index, totalCount, onMove, onRemove}) {
    return (
        <div className="group relative block">
            <div className="aspect-[2/3] overflow-hidden rounded-lg bg-muted ring-1 ring-border">
                {item.Poster && <img src={item.Poster} alt={item.Title} className="h-full w-full object-cover"/>}
            </div>

            {/* Absolute Control Overlay Layer */}
            <div
                className="absolute inset-x-0 top-0 flex justify-between p-2 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-b from-black/40 via-black/10 to-transparent rounded-t-lg">
                <div className="flex gap-1">
                    {index > 0 && (
                        <button
                            onClick={() => onMove(index, "up")}
                            className="grid h-7 w-7 place-items-center rounded-md bg-background/90 text-foreground shadow backdrop-blur hover:bg-background transition-colors"
                            aria-label="Move Up"
                        >
                            <MoveUp className="h-3.5 w-3.5"/>
                        </button>
                    )}
                    {index < totalCount - 1 && (
                        <button
                            onClick={() => onMove(index, "down")}
                            className="grid h-7 w-7 place-items-center rounded-md bg-background/90 text-foreground shadow backdrop-blur hover:bg-background transition-colors"
                            aria-label="Move Down"
                        >
                            <MoveDown className="h-3.5 w-3.5"/>
                        </button>
                    )}
                </div>
                <button
                    onClick={onRemove}
                    className="grid h-7 w-7 place-items-center rounded-md bg-background/90 text-destructive shadow backdrop-blur hover:bg-destructive/10 transition-colors"
                    aria-label="Remove"
                >
                    <X className="h-3.5 w-3.5"/>
                </button>
            </div>

            <Link to={`/title/${item.imdbID}`}>
                <div
                    className="mt-2 line-clamp-2 text-sm font-medium leading-tight hover:text-primary transition-colors">{item.Title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{item.Year}</div>
            </Link>
        </div>
    );
}