import { globalApis } from '../baseApi'

const authApi = globalApis.injectEndpoints({
    endpoints: (build) => ({
        getProfile: build.query({
            query: () => "/auth/profile",
            providesTags: ["auth"],
        }),

        createAccount: build.mutation({
            query: (data) => ({
                url: "/auth/signup",
                method: "POST",
                body: data,
            }),
        }),

        login: build.mutation({
            query: (data) => ({
                url: "/auth/signin",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["auth"],
        }),

        logout: build.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            invalidatesTags: ["auth"],
        }),
    }),
    overrideExisting: false,
})

export const {
    useGetProfileQuery,
    useCreateAccountMutation,
    useLoginMutation,
    useLogoutMutation,
} = authApi
