import { globalApis } from '../baseApi'

const dashboardApi = globalApis.injectEndpoints({
    endpoints: (build) => ({
        dashboardStats: build.query({
            query: () => `/dashboard/stats`,
        }),
    }),
    overrideExisting: false,
})

export const {
    useDashboardStatsQuery,
} = dashboardApi
