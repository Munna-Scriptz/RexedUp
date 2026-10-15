import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({
  isLoading,
  icon,
  title,
  value,
  unit = "",
  trendValue = "",
  trendType = "up",
  variant = "red",
  size,
  className
}) => {
  const variants = {
    red: "bg-red-500/10 text-red-500",
    green: "bg-green-500/10 text-green-500",
    blue: "bg-blue-500/10 text-blue-500",
    amber: "bg-amber-500/10 text-amber-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    purple: "bg-purple-500/10 text-purple-500",
    rose: "bg-rose-500/10 text-rose-500",
    slate: "bg-slate-500/10 text-slate-500",
  };

  const isSmall = size === "small";

  return (
    <div className={`bg-white md:rounded-2xl rounded-xl border border-gray-200 duration-300 hover:shadow-lg ${className} ${isSmall ? "p-3" : "md:p-5 p-3"}`}>
      {isLoading ? (
        <div className="animate-pulse">
          {/* Header Skeleton */}
          <div className="flex items-center md:gap-3 gap-2">
            <div className={`${isSmall ? "w-8 h-8 rounded-xl" : "md:w-10 w-8 md:h-10 h-8 rounded-xl"} bg-gray-200`} />
            <div className={`h-4 bg-gray-200 rounded w-20 ${isSmall ? "mt-0.5" : "mt-0"}`} />
          </div>

          {/* Content Skeleton */}
          <div className={`flex flex-col ${isSmall ? "mt-3 gap-1" : "md:mt-4 mt-2 md:gap-1.5 gap-1"}`}>
            <div className="flex items-baseline gap-2">
              <div className={`bg-gray-200 rounded w-24 ${isSmall ? "h-6" : "md:h-8 h-6"}`} />
            </div>

            <div className={`flex items-center ${isSmall ? "gap-1 mt-1.5" : "gap-2 mt-2.5"}`}>
              <div className={`bg-gray-200 rounded-full ${isSmall ? "w-10 h-4" : "w-12 h-5"}`} />
              <div className={`bg-gray-200 rounded w-16 ${isSmall ? "h-3" : "h-3.5"}`} />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center md:gap-3 gap-2">
            <div className={`${isSmall ? "w-8 h-8 rounded-xl" : "md:w-10 w-8 md:h-10 h-8 rounded-xl"} flex items-center justify-center group-hover:scale-110 ${variants[variant]}`} >
              {React.cloneElement(icon, {
                className: `w-4 h-4 md:w-6 md:h-6 ${icon.props.className || ""}`,
              })}
            </div>

            <h3 className={`font-semibold text-gray-500 ${isSmall ? "text-xs" : "md:text-sm text-xs"}`} >
              {title}
            </h3>
          </div>

          {/* Content */}
          <div className={`flex flex-col ${isSmall ? "mt-3 gap-1" : "md:mt-4 mt-2 md:gap-1.5 gap-1"}`}>
            <div className="flex items-baseline gap-2">
              <span className={`font-bold text-adminText ${isSmall ? "text-xl" : "md:text-3xl text-xl"}`} >
                {value}
              </span>

              {unit && (
                <span className={`font-bold uppercase tracking-widest text-gray-400 ${isSmall ? "text-[9px]" : "md:text-xs text-[9px]"}`} >
                  {unit}
                </span>
              )}
            </div>

            {trendValue && (
              <div
                className={`flex flex-wrap items-center ${isSmall ? "gap-1 mt-1" : "gap-2 mt-2"}`}
              >
                <div
                  className={`flex items-center gap-0.5 rounded-full font-bold ${trendType === "up"
                    ? "bg-green-500/10 text-green-600"
                    : "bg-red-500/10 text-red-600"
                    } ${isSmall
                      ? "px-1.5 py-0.5 text-[9px]"
                      : "px-2 py-0.5 text-[10px]"
                    }`}
                >
                  {trendType === "up" ? (
                    <TrendingUp size={isSmall ? 10 : 12} />
                  ) : (
                    <TrendingDown size={isSmall ? 10 : 12} />
                  )}

                  <span>{trendValue} {trendType === "up" ? "+" : "-"}</span>
                </div>

                <p
                  className={`font-medium uppercase tracking-wider text-gray-400 ${isSmall ? "text-[8px]" : "text-[10px]"}`}
                >
                  vs last month
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default StatCard;