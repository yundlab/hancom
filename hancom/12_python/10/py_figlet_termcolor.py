# 1. pyfiglet, termcolor 불러오기
# 2. pyfiglet 적용
# 3. termcolor 적용
# 4. pyfiglet + termcolor 적용된 텍스트

import pyfiglet
from termcolor import colored

sentence = "Hello World"
print(sentence)

py_sentence = pyfiglet.figlet_format(sentence)
print(py_sentence)

color_text = colored(
    sentence,
    "red",
    "on_yellow"
)
print(color_text)

py_color_text = colored(
    py_sentence,
    "white",
    "on_blue",
    ["bold"]
)
print(py_color_text)