export class SendinBlueEmail {
    subject: string;
    sender: User;
    to: User[]
    htmlContent: string;

    constructor(subject: string, sender: User, to: User[], htmlContent: string) {
        this.subject = subject;
        this.sender = sender;
        this.to = to;
        this.htmlContent = htmlContent;
    }
}
export class User {
    name: string;
    email: string;

    constructor(name: string, email: string) {
        this.name = name;
        this.email = email;
    }
}

