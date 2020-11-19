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