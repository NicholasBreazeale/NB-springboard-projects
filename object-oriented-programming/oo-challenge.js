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

class Garage {
	constructor(capacity) {
		this.capacity = capacity;
		this.vehicles = [];
	}
	add(vehicle) {
		if (!(vehicle instanceof Vehicle)) {
			return "Only vehicles are allowed in here!";
		}
		if (vehicles.length === capacity) {
			return "Sorry, we're full.";
		}
		vehicles.push(vehicle);
		return "Vehicle added!";
	}
}