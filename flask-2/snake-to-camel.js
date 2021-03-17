function snakeToCamel(str) {
	"use strict";

	return str.replace(/_./g, s => s[1].toUpperCase())
}