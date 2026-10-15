// ─── Core API Instance ───────────────────────────
export { globalApis } from './baseApi'

// ─── Endpoint Hooks ──────────────────
export {
    useGetProfileQuery,
    useCreateAccountMutation,
    useLoginMutation,
    useLogoutMutation,
} from './endpoints/authApi'


export {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
} from './endpoints/categoryApi'