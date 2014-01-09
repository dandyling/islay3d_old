/**
 * This function returns an object that emulates an associative array
 * with the passed array of XMLs as the elements
 * The key is the value of the attribute whose name is passed
 */
function Hash(nodes, attribName) {
	var hash = new Object();
	for (var i = 0; i < nodes.length; i++) {
		key = nodes[i].attributes[attribName].value;
		hash[key] = nodes[i];
		hash[key].i = i;
	}

	return hash;
	// return hash = nodes, i.e. hash[key] = nodes[i]
}

/**
 * This function returns the first element of a hash
 */
Hash.first = function(hash) {
	for (var key in hash) {
		if (hash[key].i == 0) {
			return hash[key];
		}
	}
};

Hash.firstNonIndexed = function(hash) {
	for (var key in hash) {
		return hash[key];
	}
};

var hashLength = function(hash) {
	var count = 0;
	for (var i in hash) {
		count++;
	}
	return count;
}; 