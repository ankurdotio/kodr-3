export async function sendMessage(userInput, onChunk = (chunk) => { }) {
    const response = await fetch("/api/chat/message", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userInput })
    })

    console.log(response)

    const decoder = new TextDecoder()

    for await (const chunk of response.body) {
        const text = decoder.decode(chunk);
        const lines = text.split("\n\n")
        for (const line of lines) {
            if (line.startsWith("data: ")) {
                const jsonStr = line.replace("data: ", "")
                const data = JSON.parse(jsonStr)
                onChunk(data)
            }
        }
    }
}