import { demoBoard, demoMessagesChannel1, demoMessagesChannel2 } from "./data";

/**
 * Ersetzt fetch() durch eine Mock-Funktion, die die Daten aus data.ts zurückliefert.
 * Rufen Sie diese Funktion in Ihren jeweiligen Tests.
 */
export default function mockFetch() {
    jest.spyOn(global, "fetch").mockImplementation((input: RequestInfo | URL) => {
        let data: any
        const url = input.toString();

        function board() {
            return (url.endsWith("board")) ? demoBoard : null;
        }
        function messages() {
            const channel = url.match(/\/channel\/(\d+)\/messages/);
            if (channel) {
                const channelId = channel[1];
                switch (channelId) {
                    case "123456": return {messages: demoMessagesChannel1};
                    case "987654": return {messages: demoMessagesChannel2};
                    default: return "Not found"
                }
            }
            return undefined;
        }
        function channel() {
            const channel = url.match(/\/channel\/(\d+)/);
            if (channel) {
                const channelId = channel[1];
                const data = demoBoard.channels.find(channel => channel.id == channelId)
                return data ?? "Not found";
            }
            return undefined;
        }
        function message() {
            const message = url.match(/\/message\/(\d+)/);
            if (message) {
                const messageId = message[1];
                if (message[1].startsWith("5")) {
                    return demoMessagesChannel1.find(message => message.id === messageId);
                } if (message[1].startsWith("7")) {
                    return demoMessagesChannel2.find(message => message.id === messageId);
                } else {
                    return "Not found";
                }
            }
            return undefined;
        }


        data = board() || messages() || channel() || message();
        const resp: any /* Response */ = {
            headers: new Headers(),
            ok: false,
            status: 500,
            statusText: "Internal server error",
            type: "basic",
            url: url,
            clone: () => resp,
            redirected: false,
            body: null,
            bodyUsed: false,
        }
        switch (typeof data) {
            case 'object':
                resp.headers.set("Content-Type", "application/json");
                resp.status = 200;
                resp.ok = true;
                resp.json = () => Promise.resolve(data);
                break;
            case 'string':
                resp.status = 404;
                resp.ok = false;
                resp.headers.set("Content-Type", "text/html");
                resp.text = () => Promise.resolve("<html><body><h1>Not found</h1></body></html>");
                break;
            default:
                resp.status = 400;
                resp.ok = false;
                resp.headers.set("Content-Type", "application/json");
                resp.json = () => Promise.resolve({ errors: [{ msg: "Validation error", param: "someID", location: "params", value: "someValue" }] });
        }
        return Promise.resolve(resp);
    });
}