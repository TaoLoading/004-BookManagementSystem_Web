import request from '../utils/request'

export default function createBook(book) {
  return request({
    url: '/book/create',
    method: 'post',
    data: book
  })
}
