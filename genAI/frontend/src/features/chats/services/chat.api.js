

export async function getAiResponse({ message, chatId }) {

    const res = await fetch("/api/chats", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            content: message, chatId
        })
    })

    const stream = res.body;

    const decoder = new TextDecoder();

    for await (const chunk of stream) {
        console.log(decoder.decode(chunk));
    }

}