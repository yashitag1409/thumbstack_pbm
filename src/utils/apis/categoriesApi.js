import axiosInstance from "../axios/AxiosInstance";

/**
 * 1. Create a New Category
 * @param {Object} categoryData - { name, description }
 */
export const createCategory = async (categoryData) => {
  try {
    const { data } = await axiosInstance.post("/categories/add", categoryData);
    return data;
  } catch (error) {
    console.error("Create Category Error:", error);
    // Throwing error allows Redux Thunks to handle the failure state
    throw error;
  }
};

/**
 * 2. Get All Categories
 * Fetches the complete list of genres/categories for the library
 */
export const getAllCategories = async (params = {}) => {
  const { data } = await axiosInstance.get("/categories/all", {
    params,
  });

  // console.log("getAllCategories", data);

  return data;
};
/**
 * 3. Update Category Details
 * @param {string} id - The MongoDB ID of the category
 * @param {Object} updatedData - The fields to update
 */
export const updateCategory = async (id, updatedData) => {
  try {
    const { data } = await axiosInstance.patch(
      `/categories/update/${id}`,
      updatedData,
    );
    return data;
  } catch (error) {
    console.error("Update Category Error:", error);
    throw error;
  }
};

/**
 * 4. Delete a Category
 * @param {string} id - The MongoDB ID of the category to remove
 */
export const deleteCategory = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/categories/delete/${id}`);
    return data;
  } catch (error) {
    console.error("Delete Category Error:", error);
    throw error;
  }
};
