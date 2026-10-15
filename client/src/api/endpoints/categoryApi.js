import { globalApis } from '../baseApi'

const categoryApi = globalApis.injectEndpoints({
    endpoints: (build) => ({
        getCategories: build.query({
            query: () => "/category/all",
            providesTags: ["category"]
        }),

        createCategory: build.mutation({
            query: (data) => ({
                url: "/category/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["category"],
        }),

        deleteCategory: build.mutation({
            query: (data) => ({
                url: "/category/delete",
                method: "DELETE",
                body: data,
            }),
            invalidatesTags: ["category"],
        }),
    }),
    overrideExisting: false,
})

export const {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi
