import PersonDao from "./PersonDao";
import nodemailer from 'nodemailer'
import {MailOptions} from "nodemailer/lib/smtp-transport";
import Person from "./Person";
import client, {Connection} from 'amqplib'
import {SendinBlueEmail, User} from "./Email";

enum CelebrationType {
    Birthday = "birthday",
    Nameday = "nameday"
}

export interface Celebration {
    firstName: string;
    lastName: string;
    type: CelebrationType
    age?: number;
    celebrationIn?: number;
}

export class EventHandler {
    private personDao: PersonDao;

    constructor() {
        this.personDao = new PersonDao();
    }

    async handle(): Promise<void> {
        let people = await this.personDao.getPeople();

        if (people.length > 0) {
            let celebrations = this.getCelebrations(people);
            console.log("Celebrations found> " + JSON.stringify(celebrations));

            if (celebrations.length > 0) {
                const text = this.parseCelebrationsToString(celebrations);
                console.log(text);

                let emails: string[] = (process.env.EMAILS || "").split(" ");

                for (const email of emails) {
                    let sendinBlueEmail = new SendinBlueEmail("Celebrator 3000 Reminder!", new User("Celebrator3000", "celebrator3000@tomondre.com"), [new User("User", email)], text);
                    console.log("Email> Sending: " + JSON.stringify(sendinBlueEmail));

                    await this.sendEmailToRabbitMQ(sendinBlueEmail);
                }

                // await this.sendBasinEmail(text);
                // await this.sendEmail(text);
            } else {
                console.log("No celebrations for today!")
            }
        } else {
            console.log("No people found in database!")
        }
    }

    private getCelebrations(people: Person[]): Celebration[] {
        const result: Celebration[] = [];
        people.forEach(person => {
            if (this.isDayAndMonthTheSameAsToday(person.nameDay)) {
                result.push({
                    firstName: person.firstName,
                    lastName: person.lastName,
                    type: CelebrationType.Nameday
                })
            }

            if (this.isDayAndMonthTheSameAsToday(person.dateOfBirth)) {
                const age = this.getPersonAge(person);
                result.push({
                    firstName: person.firstName,
                    lastName: person.lastName,
                    type: CelebrationType.Birthday,
                    age
                });
            }
        });
        return result;
    }

    private isDayAndMonthTheSameAsToday(date: Date): boolean {
        let today = new Date();
        return this.isDayAndMonthTheSameAs(date, today);
    }

    private isDayAndMonthTheSameAs(firstDate: Date, secondDate: Date): boolean {
        return firstDate.getDate() === secondDate.getDate() && firstDate.getMonth() === secondDate.getMonth();
    }

    private getPersonAge(person: Person): number {
        var ageDifMs = Date.now() - person.dateOfBirth.getTime();
        var ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    private parseCelebrationsToString(celebrations: Celebration[]): string {
        let result = "";

        celebrations.forEach(celebration => {
            let age;
            if (celebration.type == CelebrationType.Birthday) {
                result += "Birthday: ";
                age = celebration.age;
            } else {
                result += "Nameday: "
            }
            result += `${celebration.firstName} ${celebration.lastName}${age ? `, age: ${age}` : ''}\n`;
        });

        return result;
    }

    private async sendEmail(text: string) {
        const user = process.env.MAIL_USERNAME;
        const pass = process.env.MAIL_PASSWORD

        const to = "tomas.ondrejka2000@gmail.com"

        const transport = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user,
                pass
            }
        });

        await transport.verify()

        var mailOptions: MailOptions = {
            from: user,
            to,
            subject: `New Celebrations today! ${new Date().toLocaleDateString("en-US")}`,
            text
        }

        console.log(`Sending mail> ${JSON.stringify(mailOptions)}`)
        transport.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("Email sending error>" + err);
            } else {
                console.log("Email sent> " + JSON.stringify(info));
            }
        });
    }

    // private async sendBasinEmail(text: string) {
    //     let basinHost = process.env.BASIN_HOST || "";
    //
    //     const body = {
    //         Date: new Date().toLocaleDateString("en-US"),
    //         Celebrations: text
    //     }
    //
    //     const options = {
    //         method: "POST",
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify(body)
    //     }
    //     let response = await fetch(basinHost, options);
    //     if (response.ok) {
    //         console.log("Email successfully send> " + JSON.stringify(options));
    //     } else {
    //         console.log("Email sending error> " + JSON.stringify(response));
    //     }
    // }
    private async sendEmailToRabbitMQ(email: SendinBlueEmail) {
        const username = process.env.RABBITMQ_USERNAME;
        const password = process.env.RABBITMQ_PASSWORD;
        const host = process.env.RABBITMQ_HOST;
        const port = process.env.RABBITMQ_PORT;

        const connection: Connection = await client.connect(`amqp://${username}:${password}@${host}:${port}`)

        const channel = await connection.createChannel()

        const queueName = "email"

        await channel.assertQueue(queueName);
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(email)));
        await channel.close();
        console.log("Send!")
    }
}