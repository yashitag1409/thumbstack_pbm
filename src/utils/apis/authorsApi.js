import axiosInstance from "../axios/AxiosInstance";

/**
 * 1. Create a New Author
 * @param {FormData} authorData - Must contain 'name', 'biography', and 'profileImage' (file)
 */
export const addAuthor = async (authorData) => {
  try {
    const { data } = await axiosInstance.post("/authors/add", authorData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    console.error("Add Author Error:", error);
    throw error;
  }
};

/**
 * 2. Get All Authors
 * Fetches the list of all authors in the vault
 */
export const getAllAuthors = async (params = {}) => {
  try {
    const { data } = await axiosInstance.get("/authors/all", { params });

    console.log("getAllAuthors", data);

    return data;
  } catch (error) {
    console.error("Get All Authors Error:", error);
    throw error;
  }
};

/**
 * 3. Update Author Details
 * @param {string} id - Author MongoDB ID
 * @param {Object|FormData} updatedData - Fields to update
 */
export const updateAuthor = async (id, updatedData) => {
  try {
    // If updating the profile image, ensure updatedData is FormData
    const isFormData = updatedData instanceof FormData;

    const { data } = await axiosInstance.patch(
      `/authors/update/${id}`,
      updatedData,
      {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
      },
    );
    return data;
  } catch (error) {
    console.error("Update Author Error:", error);
    throw error;
  }
};

/**
 * 4. Delete an Author
 * @param {string} id - Author MongoDB ID
 */
export const deleteAuthor = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/authors/delete/${id}`);
    return data;
  } catch (error) {
    console.error("Delete Author Error:", error);
    throw error;
  }
};
