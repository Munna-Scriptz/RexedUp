import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include"
})

let isRefreshing = false

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result.error?.status === 401) {
        const url = typeof args === 'string' ? args : args.url;

        // 1. Prevent infinite loop on refresh or logout endpoints
        if (url.includes('/auth/refreshAccessToken') || url.includes('/auth/logout')) {
            return result
        }

        // 2. Prevent multiple simultaneous refresh attempts
        if (!isRefreshing) {
            isRefreshing = true

            const refreshResult = await baseQuery(
                { url: "/auth/refreshAccessToken", method: "POST" },
                api,
                extraOptions
            )

            isRefreshing = false

            if (refreshResult?.data) {
                // Retry original request
                result = await baseQuery(args, api, extraOptions)
            } else {
                // Refresh failed: purge state & trigger logout
                api.dispatch(globalApis.util.resetApiState())
                await baseQuery({ url: "/auth/logout", method: "POST" }, api, extraOptions)
            }
        }
    }

    return result
}

export const globalApis = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ["auth", "meme", "category"],
    endpoints: () => ({}),
})
