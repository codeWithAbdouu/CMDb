import {Link} from "react-router-dom";

function PageNotFound() {
    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4">
            <div className="max-w-md text-center">
                <h1 className="font-display text-7xl font-bold">404</h1>
                <p className="mt-2 text-muted-foreground">This title isn't in our catalogue.</p>
                <Link
                    to="/"
                    className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                    Go home
                </Link>
            </div>
        </div>
    );
}

export default PageNotFound
