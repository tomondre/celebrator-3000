import {EventHandler} from "./EventHandler";

async function handleEvent() {
    let eventHandler = new EventHandler();
    try {
        await eventHandler.handle();
    } catch (e) {
        console.log(e);
    }
}
handleEvent();

// cron.schedule(expression, async () => {
//     await handleEvent();
// });


