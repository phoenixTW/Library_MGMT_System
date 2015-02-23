exports.countBooks = function(books) {
	var countOfBooks = {};
	books.forEach(function(book){
		if(Object.keys(countOfBooks).indexOf(book)>-1)
			countOfBooks[book]++;
		else
			countOfBooks[book] = 1;
	});
	return countOfBooks;
}