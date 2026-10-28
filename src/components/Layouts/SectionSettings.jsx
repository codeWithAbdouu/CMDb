function Section({title, description, children}) {
    return (
        <section className="mt-8 rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold">{title}</h2>
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            <div className="mt-4">{children}</div>
        </section>
    );
}

export default Section;