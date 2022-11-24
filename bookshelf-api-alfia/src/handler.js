/*
Import from books.js and nanoid
*/

const { nanoid } = require('nanoid');
const books = require('./books');

/*
Add books
*/
// eslint-disable-next-line consistent-return
const createBooksHandler = (request, h) => {
  // Get body request
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16); // define id
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage; // check if finished

  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  try {
    // Check name key
    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    // Check if readPage > pageCount
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    books.push(newBooks);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }
  } catch (error) {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  }
};

/*
Get All books
*/
// eslint-disable-next-line consistent-return
const getAllBooksHandler = (request, h) => {
  // Get parameter reading and finished
  const { reading, finished, name } = request.query;

  // For getting all books
  const allBooks = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  const response = h.response({
    status: 'success',
    data: {
      books: allBooks,
    },
  });

  // If reading true
  if (reading === '1') {
    const readBooks = books.filter((book) => book.reading === true).map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    return h.response({
      status: 'success',
      data: {
        books: readBooks,
      },
    });
  }

  // If reading false
  if (reading === '0') {
    const unreadBooks = books.filter((book) => book.reading === false).map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    return h.response({
      status: 'success',
      data: {
        books: unreadBooks,
      },
    });
  }

  // If finished true
  if (finished === '1') {
    const finBooks = books.filter((book) => book.finished === true).map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    return h.response({
      status: 'success',
      data: {
        books: finBooks,
      },
    });
  }

  // If finished false
  if (finished === '0') {
    const unfinBooks = books.filter((book) => book.finished === false).map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    return h.response({
      status: 'success',
      data: {
        books: unfinBooks,
      },
    });
  }

  // If there is name
  if (name !== undefined) {
    const namedBooks = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
      .map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));

    return h.response({
      status: 'success',
      data: {
        books: namedBooks,
      },
    });
  }

  response.code(200);
  return response;
};

/*
Get a book by ID
*/
// eslint-disable-next-line consistent-return
const getBookByIdHandler = (request, h) => {
  // Get parameter bookId
  const { bookId } = request.params;

  // Get existing data with specified id
  const book = books.filter((b) => b.id === bookId)[0];

  // If book's found
  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  // If book's not found
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

/*
Update a book
*/
// eslint-disable-next-line consistent-return
const updateBookByIdHandler = (request, h) => {
  // Get parameter bookId
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
  } = request.payload;

  const updatedAt = new Date().toISOString();

  // Find the specified book's Index
  const bIndex = books.findIndex((book) => book.id === bookId);

  // Check if name is exist in the parameter
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // Check if readPage > pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // Update Book
  if (bIndex !== -1) {
    books[bIndex] = {
      ...books[bIndex],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
/*
Delete a book
*/
const delBookByIdHandler = (request, h) => {
  // Get parameter bookId
  const { bookId } = request.params;

  // Get data with specified bookId
  const bIndex = books.findIndex((book) => book.id === bookId);

  // If book's found
  if (bIndex !== -1) {
    books.splice(bIndex, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  // If book's not found
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

/*
Export module
*/
module.exports = {
  createBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  delBookByIdHandler,
};
