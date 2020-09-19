import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import { Photo } from "../entities/photo.entity";

@EventSubscriber()
export class PhotoSubscriber implements EntitySubscriberInterface<Photo> {
    constructor(connection: Connection) {
        connection.subscribers.push(this);
    }

    listenTo() {
        return Photo;
    }

    beforeInsert(event: InsertEvent<Photo>) {
        console.log(`Before photo inserted`, event.entity);
    }
}