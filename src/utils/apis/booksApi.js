const { default: axiosInstance } = require("../axios/AxiosInstance");

// 1. Add New Book (Accepts FormData for thumbNail and pageImages)
module.exports.addBook = async (bookData) => {
  try {
    const { data } = await axiosInstance.post("/books/add_book", bookData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    console.error("Add Book Error:", error);
    throw error;
  }
};

// 2. Get All Books
// utils/apis/booksApi.js

module.exports.getAllBooks = async ({
  page = 1,
  limit = 10,
  category,
  status,
  isFavorite,
  search,
} = {}) => {
  try {
    const { data } = await axiosInstance.get("/books/all", {
      params: {
        page,
        limit,
        category,
        status,
        isFavorite,
        search,
      },
    });

    console.log("getAllBooks", data);

    return data;
  } catch (error) {
    console.error("Get All Books Error:", error);
    throw error;
  }
};

// 3. Get Books Grouped By Category
module.exports.getGroupedBooks = async () => {
  try {
    const { data } = await axiosInstance.get("/books/group_books");
    return data;
  } catch (error) {
    console.error("Get Grouped Books Error:", error);
    throw error;
  }
};

// 4. Get Single Book Details by ID
module.exports.getSingleBook = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/books/${id}`);

    // console.log("data from get single book 📷📷", data);

    return data.data;
  } catch (error) {
    console.error("Get Single Book Error:", error);
    throw error;
  }
};

// 5. Update Book (Accepts id and FormData)
module.exports.updateBook = async (id, updatedData) => {
  try {
    const { data } = await axiosInstance.patch(
      `/books/update/${id}`,
      updatedData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return data;
  } catch (error) {
    console.error("Update Book Error:", error);
    throw error;
  }
};

// 6. Delete a Specific Book
module.exports.deleteBook = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/books/delete/${id}`);
    return data;
  } catch (error) {
    console.error("Delete Book Error:", error);
    throw error;
  }
};

// api for all books where isfavourite = true

module.exports.getFavouriteBooks = async () => {
  try {
    const { data } = await axiosInstance.get("/books/all", {
      params: {
        isFavorite: true,
      },
    });

    return data.data;
  } catch (error) {
    console.error("Get Favourite Books Error:", error);
    throw error;
  }
};
