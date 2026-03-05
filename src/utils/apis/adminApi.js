import axiosInstance from "../axios/AxiosInstance";

// get all origins
export const getAllOrigins = async () => {
  try {
    const { data } = await axiosInstance.get("/admin/all");

    return data;
  } catch (error) {
    throw error;
  }
};

// add origin
export const addOrigin = async (origin) => {
  try {
    const { data } = await axiosInstance.post("/admin/add", origin);

    return data;
  } catch (error) {
    throw error;
  }
};

// update origin
export const updateOrigin = async (id, origin) => {
  try {
    const { data } = await axiosInstance.patch(`/admin/update/${id}`, origin);

    return data;
  } catch (error) {
    throw error;
  }
};

// delete origin
export const deleteOrigin = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/admin/delete/${id}`);

    return data;
  } catch (error) {
    throw error;
  }
};
