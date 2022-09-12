export default class Email {
    private _subject: string;
    private _body: string;

    constructor(subject: string, body: string) {
        this._subject = subject;
        this._body = body;
    }

    get subject(): string {
        return this._subject;
    }

    set subject(value: string) {
        this._subject = value;
    }

    get body(): string {
        return this._body;
    }

    set body(value: string) {
        this._body = value;
    }
}