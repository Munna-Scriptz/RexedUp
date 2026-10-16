import { useState } from "react";
import { LoaderCircle } from "lucide-react";

const ImageWithLoader = ({ src, alt = "", className = "" }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {loading && !error && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-bg">
                    <LoaderCircle
                        className="h-8 w-8 text-gray-500 animate-spin"
                        aria-label="Loading image"
                    />
                </div>
            )}

            {error ? (
                <div className="flex h-full min-h-24 items-center justify-center bg-bg text-sm text-gray-500">
                    Failed to load image
                </div>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    onLoad={() => setLoading(false)}
                    onError={() => {
                        setLoading(false);
                        setError(true);
                    }}
                    className={`h-full w-full object-cover transition-opacity duration-200 ${loading ? "opacity-0" : "opacity-100"}`}
                />
            )}
        </div>
    );
};

export default ImageWithLoader;
