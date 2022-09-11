import {PrismaClient} from '@prisma/client'
import Person from "./Person";

export default class PersonDao {

    private client: PrismaClient

    constructor() {
        this.client = new PrismaClient({log: ['query', 'info', 'warn', 'error']});
    }

    async createPerson(person: Person): Promise<Person> {
        const [nameDay, per] = await this.client.$transaction([
            this.client.nameDay.upsert({
                where: {
                    name: person.firstName
                },
                update: {},
                create: {
                    name: person.firstName,
                    day: person.nameDay
                }
            }),
            this.client.person.create({
                data: {
                    firstName: person.firstName,
                    lastName: person.lastName,
                    dateOfBirth: person.dateOfBirth
                }

            })
        ]);

        return person;
    }

    async getPeople(): Promise<Person[]> {
        let people: Person[] = [];

        let dbPeople = await this.client.person.findMany({
            include: {
                nameDay: true
            }
        });

        dbPeople.forEach((person) => {
            people.push(new Person(person.id, person.firstName, person.lastName, person.dateOfBirth, person.nameDay.day))
        });

        return people;
    }
}