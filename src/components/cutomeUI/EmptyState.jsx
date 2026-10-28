function EmptyState({icon, title = "No results found", description, action}) {
    return (
        <div
            className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
            {icon && <div className="mb-3 text-muted-foreground">{icon}</div>}
            <h3 className="font-display text-lg font-semibold">{title}</h3>
            {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}

export default EmptyState;