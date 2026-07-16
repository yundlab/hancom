mixed = [1, "Hello", 3.14, True]


# 기본 FOR문 반복
for i in mixed:
    print(i)
# 1
# Hello
# 3.14
# True

# ENUMERATE - 인덱스 + 값 동시 출력
for index, item in enumerate(mixed):
    print(f"index: {index}, item: {item}")
# index: 0, item: 1
# index: 1, item: Hello
# index: 2, item: 3.14
# index: 3, item: True