import { globalApis } from "../baseApi";

const memeTemplateApi = globalApis.injectEndpoints({
    endpoints: (build) => ({
        getMemeTemplates: build.query({
            query: () => "/memes/templates",
            providesTags: ["meme"],
        }),
        uploadMemeTemplate: build.mutation({
            query: (template) => ({
                url: "/memes/templates",
                method: "POST",
                body: template,
            }),
            invalidatesTags: ["meme"],
        }),
        updateMemeTemplate: build.mutation({
            query: ({ id, ...updates }) => ({
                url: `/memes/templates/${id}`,
                method: "PATCH",
                body: updates,
            }),
            invalidatesTags: ["meme"],
        }),
        deleteMemeTemplate: build.mutation({
            query: (id) => ({
                url: `/memes/templates/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["meme"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetMemeTemplatesQuery,
    useUploadMemeTemplateMutation,
    useUpdateMemeTemplateMutation,
    useDeleteMemeTemplateMutation,
} = memeTemplateApi;
