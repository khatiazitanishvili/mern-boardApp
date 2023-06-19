/* istanbul ignore file */
import { ChannelResource, MessagesResource, MessageResource, BoardResource } from "../ChannelResources"
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

export class ErrorFromValidation extends Error {
    param: string | undefined;
    status: number;
    validationErrors: ValidationError[];
    validationError: any;

    private static msg(validationErrors: ValidationError[]): string {
        if (validationErrors.length === 0) {
            return "Unspecified validation error";
        }
        return validationErrors.map((validationError) => {
            return `${validationError.msg} (${validationError.location} ${validationError.param}, value ${validationError.value})`;
        }).join(". ");
    }

    constructor(status: number, validationErrors: ValidationError[]) {
        super(ErrorFromValidation.msg(validationErrors));
        this.status = status;
        this.validationErrors = validationErrors;
    }
}

export class ErrorWithHTML extends Error {
    html: string;
    status: number;

    constructor(status: number, html: string) {
        super("Error");
        this.status = status;
        let bodyStart = html.indexOf("<body");
        if (bodyStart >= 0) {
            bodyStart = html.indexOf(">", bodyStart);
        }
        const bodyEnd = html.indexOf("</body>", bodyStart);
        if (bodyStart >= 0 && bodyEnd >= 0) {
            this.html = "<div>" + html.substring(bodyStart + 1, bodyEnd) + "</div>";
        } else {
            this.html = html;
        }

    }
}

/**
 * ValidationError created by express-validator (without nested errors).
 */
type ValidationError = {
    msg: string;
    param: string;
    location: string;
    value: string;
}

/**
 * Funktioniert wie fetch, parst aber die Antwort als JSON oder wirft eine Exception.
 * 
 * Falls die Antwort ein Validierungsfehler ist (Status 400), wird eine Exception vom Typ ErrorFromValidation geworfen.
 * Falls die Antwort ein HTML-Dokument ist (Status 404/500), wird eine Exception vom Typ ErrorWithHTML geworfen.
 * 
 * Sowohl ErrorFromValidation als auch ErrorWithHTML sind von Error abgeleitet, haben eine zusätzliche Eigenschaft "status"
 * und können in der Komponente, die im Fehlerfall angezeigt wird, verwendet werden, um den Fehler genauer anzuzeigen.
 */
async function fetchWithErrorHandling<R>(url: string, init?: RequestInit): Promise<R> {

    const response: Response = await fetch(url, init);

    const contentType = response.headers.get("Content-Type") ?? "";
    if (contentType.startsWith("application/json")) {
        const data = await response.json()
        if (response.ok) {
            return data;
        }
        if (data.errors instanceof Array) {
            const validationErrors = data.errors as ValidationError[];
            throw new ErrorFromValidation(response.status, validationErrors);
        } else {
            throw new Error(`Status ${response.status}: ${JSON.stringify(data)}`);
        }
    } else if (contentType.startsWith("text/html")) {
        const html = await response.text();
        throw new ErrorWithHTML(response.status, html);
    } else if (contentType.startsWith("text/plain")) {
        const text = await response.text();
        throw new Error(`Status ${response.status}: ${text}`);
    }

    if (response.ok) {
        return undefined as unknown as R;
    }
    throw new Error(`Status ${response.status}`);

}

const HOST = process.env.REACT_APP_API_SERVER_URL;

/**
 * Ergänzen Sie hier die Anbindung an den Server
 */
// export async function getBoard() {
//     const url = `${HOST}/board`;
//     try {
//         const response = await fetch(url)
//         if (response.ok) {
//             return await response.json();
//         } else {
//             throw new Error(`Error connecting to ${HOST}: ${response.statusText}`);
//         }
//     } catch (error) {
//         throw error;
//     }
// }



export async function getBoard(): Promise<BoardResource> {
    const url = `${HOST}/board`;
    const response = await fetch(url);
    return await response.json();
}



export async function getChannel(channelId: string): Promise<ChannelResource> {
    const url = `${HOST}/channel/${channelId}`;
    const response = await fetch(url)
    return await response.json();
}

export async function createChannel(channel: ChannelResource): Promise<boolean> {
    const url = `${HOST}/channel`;
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ "name": channel.name, "description": channel.description, "ownerId": channel.ownerId, "public": channel.public, "closed": channel.closed }),

        headers: {
            Accept: "application/json",
            "Content-type": "application/json"
        }
    });
    return response.ok;
}

export async function updateChannel(channel: ChannelResource): Promise<boolean> {
    const url = `${HOST}/channel/${channel.id}`;
    const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(channel),

        headers: {
            Accept: "application/json",
            "Content-type": "application/json"
        }
    });
    return response.ok;
}


export async function deleteChannel(channel: ChannelResource): Promise<boolean> {
    const url = `${HOST}/channel/${channel.id}`;
    const response = await fetch(url, {
        method: 'DELETE',
        body: JSON.stringify(channel),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    });
    return response.ok;
}




export async function login(email: string, password: string): Promise<Boolean> {
    const url = `${HOST}/login`;

    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    });
    return response.ok
}

export function getUserIDFromJWT() {
    const cookie = Cookies.get("access_token");
    if (cookie) {
        const jwt: any = jwtDecode(cookie);
        const userId = jwt.sub;
        return userId;
    }
    return undefined;
}

export function logout() {
    Cookies.remove("access_token");
}



export async function getMessage(messageId: string): Promise<MessageResource> {
    const url = `${HOST}/message/${messageId}`;
    const response = await fetch(url)
    return await response.json();
}

export async function getMessages(channelId: string): Promise<MessagesResource> {
    const url = `${HOST}/channel/${channelId}/messages`;
    const response = await fetch(url)
    return await response.json();
}


export async function createMessage(message: MessageResource): Promise<boolean> {
    const url = `${HOST}/message/`;
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(message),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    });
    return response.ok;
}

export async function updateMessage(message: MessageResource): Promise<boolean> {
    const url = `${HOST}/message/${message.id}`;
    const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(message),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    });
    return response.ok;
}

export async function deleteMessage(message: MessageResource): Promise<boolean> {
    const url = `${HOST}/message/${message.id}`;
    const response = await fetch(url, {
        method: 'DELETE',
        body: JSON.stringify(message),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    });
    return response.ok;
}


