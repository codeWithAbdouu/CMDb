import {List as ListIcon} from "lucide-react";

function ListCovers({items = []}) {
    // Map clean, un-wrapped poster values safely
    const covers = items.slice(0, 4).map((i) => i.Poster).filter(Boolean);

    if (covers.length === 0) {
        return (
            <div className="aspect-[3/2] grid place-items-center bg-muted text-muted-foreground border-b border-border">
                <ListIcon className="h-10 w-10 stroke-[1.5]"/>
            </div>
        );
    }

    return (
        <div className="grid aspect-[3/2] grid-cols-2 gap-px bg-border border-b border-border">
            {Array.from({length: 4}).map((_, i) => (
                <div key={i} className="overflow-hidden bg-muted">
                    {covers[i] ? (
                        <img
                            src={covers[i]}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover"
                        />
                    ) : null}
                </div>
            ))}
        </div>
    );
}

export default ListCovers;