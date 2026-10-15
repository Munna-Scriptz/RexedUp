import { useState } from "react";
import Home from "../Home";
import { useUploadMemeTemplateMutation } from "../../api";

const getErrorMessage = (error) =>
    error?.data?.message || error?.data?.error || error?.error || "Upload failed. Please try again.";

const AdminUpload = () => {
    const [upload, { isLoading }] = useUploadMemeTemplateMutation();
    const [error, setError] = useState("");

    const uploadTemplate = async (template) => {
        setError("");
        try {
            await upload(template).unwrap();
        } catch (requestError) {
            setError(getErrorMessage(requestError));
            throw requestError;
        }
    };

    return <Home adminMode onUploadTemplate={uploadTemplate} uploadBusy={isLoading} uploadError={error} />;
};

export default AdminUpload;
