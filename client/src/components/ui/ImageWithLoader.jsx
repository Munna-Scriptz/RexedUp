import { useState } from "react";
import { LoaderCircle } from "lucide-react";

const ImageWithLoader = ({ src, alt = "", className = "" }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {loading && !error && (
                <div
                    className="absolute inset-0 z-10 flex items-center justify-center bg-bg/95"
                    role="status"
                    aria-label="Loading image"
                >
                    <div className="relative flex h-11 w-11 items-center justify-center">
                        <div className="absolute inset-0 rounded-full border border-cyan-400/10" />

                        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-cyan-400 border-r-cyan-400/30" />

                        <LoaderCircle
                            className="h-4 w-4 text-cyan-400/80"
                            strokeWidth={1.8}
                        />
                    </div>
                </div>
            )}

            {error ? (
                <div className="flex h-full min-h-24 items-center justify-center bg-bg text-xs text-gray-500">
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
                    className={`h-full w-full object-cover transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"
                        }`}
                />
            )}
        </div>
    );
};

export default ImageWithLoader;
