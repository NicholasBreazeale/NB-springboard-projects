class Vehicle {
	constructor(make, model, year) {
		this.make = make;
		this.model = model;
		this.year = year;
	}
	honk() {
		return "Beep.";
	}
	toString() {
		return `The vehicle is a ${this.make} ${this.model} from ${this.year}.`;
	}
}

class Car extends Vehicle {
	constructor(make, model, year) {
		this.numWheels = 4;
		super(make, model, year);
	}
}

class Motorcycle extends Vehicle {
	constructor(make, model, year) {
		this.numWheels = 2;
		super(make, model, year);
	}
	revEngine() {
		return "VROOM!!!";
	}
}