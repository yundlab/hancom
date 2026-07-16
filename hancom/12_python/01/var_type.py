x = 10              # int (주석 => Ctrl + /)
y = 3.14            # float
name = 'Python'     # str
is_fun = True       # bool
colors = ['red', 'green', 'blue']   # list(순서 있음, 수정 가능)
coords = (10, 10)                   # tuple(순서 있음, 수정 불가)
person = {'name': 'Tom', 'age':40}  # dict(키-값 쌍)
nums = {1, 2, 3}                    # set(중복 불가, 순서 없음)
nothing = None                      # NoneType

# 네이밍 스타일 (Python)
# snake_case => 변수명, 함수명
# PascalCase => 클래스명
# camelCase => JS

# print(type(name))
# <class 'str'>

# print(type(is_fun))
# <class 'bool'>

# print(isinstance(x, int)) => x가 int가 맞는지 확인
# True

# print(isinstance(x, str))
# False