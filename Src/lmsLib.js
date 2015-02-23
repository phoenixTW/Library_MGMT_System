exports.countBooks = function(books) {
	var countOfBooks = {};
	
	books.forEach(function(book){
		(Object.keys(countOfBooks).indexOf(book)>-1)
			? countOfBooks[book]++ : countOfBooks[book] = 1;
	});

	return countOfBooks;
}