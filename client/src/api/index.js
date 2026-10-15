// ─── Core API Instance ───────────────────────────
export { globalApis } from './baseApi'

// ─── Endpoint Hooks ──────────────────
export {
    useGetProfileQuery,
    useGetVapidPublicKeyQuery,
    useSaveSubscriptionMutation,
    useUpdateProfileMutation,
    useCreateAccountMutation,
    useLoginMutation,
    useLogoutMutation,
    useGetAdminUsersQuery,
    useGetAdminUserDetailsQuery,
    useGetAdminPaymentsQuery,
} from './endpoints/authApi'


export {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
} from './endpoints/categoryApi'