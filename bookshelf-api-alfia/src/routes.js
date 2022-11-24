/*
Import functions from handler.js
*/
const {
  createBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  delBookByIdHandler,
} = require('./handler');

/*
API Routing Configuration
*/
const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: createBooksHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateBookByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: delBookByIdHandler,
  },
];

/*
Export route
*/
module.exports = routes;
