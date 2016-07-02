class Greeter {
    constructor(public greeting: string) { }
    greet() {
        return this.greeting;
    }
}

var greeter = new Greeter('TypeScript works!');

console.log(greeter.greet());