
export default class Person {
    private _id: number;
    private _firstName: string;
    private _lastName: string;
    private _dateOfBirth: Date;
    private _nameDay: Date;

    constructor(id: number, firstName: string, lastName: string, dateOfBirth: Date, nameDay: Date) {
        this._id = id;
        this._firstName = firstName;
        this._lastName = lastName;
        this._dateOfBirth = dateOfBirth;
        this._nameDay = nameDay;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get firstName(): string {
        return this._firstName;
    }

    set firstName(value: string) {
        this._firstName = value;
    }

    get lastName(): string {
        return this._lastName;
    }

    set lastName(value: string) {
        this._lastName = value;
    }

    get dateOfBirth(): Date {
        return this._dateOfBirth;
    }

    set dateOfBirth(value: Date) {
        this._dateOfBirth = value;
    }

    get nameDay(): Date {
        return this._nameDay;
    }

    set nameDay(value: Date) {
        this._nameDay = value;
    }
}