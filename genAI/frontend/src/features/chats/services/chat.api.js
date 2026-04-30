

export async function getAiResponse({ message, chatId, onContent, onChat, onComplete }) {

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
        const response = decoder.decode(chunk)

        response.split('\n').forEach(line => {

            if (line.startsWith("data:")) {
                onContent(JSON.parse(line.replaceAll("data:", "")).text)
            }
            if (line.startsWith("title:")) {
                const chat = JSON.parse(line.replace("title: ", ""))
                onChat({
                    id: chatId,
                    title: chat.title,
                    messages: []
                })
            }
        })

    }

    onComplete()



}