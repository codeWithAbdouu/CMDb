function PageHeader({ title = "Page Title", subtitle, action }) {
    return (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-1">
                <h1 className="text-balance text-3xl font-semibold md:text-4xl">{title}</h1>
                {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {action}
        </div>
    );
}

export default PageHeader;