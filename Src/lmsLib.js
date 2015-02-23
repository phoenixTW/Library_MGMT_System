exports.countBooks = function(books) {
	var countOfBooks = {};
	console.log('------------->>>', books);
	books.forEach(function(book){
		(Object.keys(countOfBooks).indexOf(book.book_names)>-1)
			? countOfBooks[book.book_name]++ : countOfBooks[book.book_name] = 1;
	});

	return countOfBooks;
}