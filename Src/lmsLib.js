exports.countBooks = function(books) {
	var countOfBooks = [];

	books.forEach(function(book){
		var book_name = book.book_name;
		var book_details = {};
		
		if (countOfBooks.length == 0)
			return ((book_details.name = book_name) && (book_details.count = 1)) && countOfBooks.push(book_details);

		var isExists = false;

		countOfBooks.forEach(function (stat) {
			(stat.name) && stat.count++ && (isExists = true);
		});

		(!isExists) && ((book_details.name = book_name) && (book_details.count = 1)) && countOfBooks.push(book_details);
	});

	return countOfBooks;
}