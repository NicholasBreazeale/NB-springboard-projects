const createInstructor = (firstName, lastName) => ({firstName, lastName});

let favoriteNumber = 42;
let instructor = {
	firstName: "Colt",
	[favoriteNumber]: "That is my favorite!"
}

instructor = {
	firstName: "Colt",
	sayHi() {
		return "Hi!";
	},
	sayBye() {
		return this.firstName + " says bye!";
	}
}

const createAnimal = (species, verb, noise) => ({
	species,
	[verb]() {
		return this.noise;
	},
	noise
});