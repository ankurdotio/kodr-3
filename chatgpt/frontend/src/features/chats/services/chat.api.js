export async function sendMessage(message) {
    const response = await fetch("/api/chat/message", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
    })

    const decoder = new TextDecoder()

    for await (const chunk of response.body) {
        const text = decoder.decode(chunk);
        console.log(text);
    }
}