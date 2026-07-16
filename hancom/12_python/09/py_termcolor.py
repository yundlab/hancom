from termcolor import colored

# colored(출력할 문자열, 글자색, 배경색, attrs=[스타일])

color_sentence = colored(
    "Hello",
    "red",
    "on_yellow",
    ["bold"]
)

print(color_sentence)
