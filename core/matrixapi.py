from typing import List


class Message:
    def __init__(self, text: str, author: str):
        self.text = text
        self.author = author


class MatrixAPI:
    history:List[Message] = []
    def __init__(self):
        pass

    def quack(self) -> str:
        return "QUACK!!"
    def append_message(self, text, author):
        self.history.append(Message(text, author))
    
