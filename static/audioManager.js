function playAudioFromStatic(fileName) {
    if (document.readyState === "complete") {
        const audio = new Audio(`/static/assets/audio/${fileName}`);
        audio.play();
        audio.onended = () => {
            audio.remove();
        };
    } else {
        console.error(
            "Audio cannot be played because the user has not interacted with the page."
        );
    }
}
