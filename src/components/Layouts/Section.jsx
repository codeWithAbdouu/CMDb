function Section({title = "Section Title", subtitle, action, children}) {
    return (
        <section className="space-y-3">
            <div className="flex items-end justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="font-display text-xl font-semibold tracking-tight md:text-2xl">{title}</h2>
                    {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                </div>
                {action}
            </div>
            {children}
        </section>
    );
}

export default Section;