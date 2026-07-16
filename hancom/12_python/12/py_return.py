from termcolor import colored

def highlight(text:str, color:str) -> str:
    """
    text, color를 입력받아서 text 색상을 변경하는 함수
        
        text : str
        color : str
    """
    color_text = colored(text, color)
    return color_text

# print 1번 방법
results = highlight("YUN", "yellow")
print(results)

# print 2번 방법
print(highlight("YUN", "yellow"))

# return을 언제 쓰는가?
    # 결과 값을 바깥으로 건네줄 때
    # 결과를 변수에 담아 다른 곳에서도 쓸 수 있게 해줌