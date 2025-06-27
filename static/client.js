const testButton = document.getElementById("test-button");
const testOutput = document.getElementById("test-output");

testButton.addEventListener("click", async () => {
    try {
        const response = await fetch("/api/quack");
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data = await response.text(); // или .json(), если сервер возвращает JSON
        testOutput.innerText = data;
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
        testOutput.innerText = "Ошибка: " + error.message;
    }
});
