names = ["뽀삐", "초코", "쿠키"]
scores = [95, 88, 72]


# 기본 - 두 리스트 같이 돌리기
for name, score in zip(names, scores):
    print(f"{name} : {score}")
# 뽀삐 : 95
# 초코 : 88
# 쿠키 : 72


# for문 없이 1 - LIST(ZIP(...))
pairs = list(zip(names, scores))
print(pairs)
# [('뽀삐', 95), ('초코', 88), ('쿠키', 72)]


# for문 없이 2 - DICT(ZIP(...))
keys = ['이름', '나이', '직업']
values = ['홍길동', 30, '개발자']

person = dict(zip(keys, values))
print(person)
# {'이름': '홍길동', '나이': 30, '직업': '개발자'}


# list vs dict — 어떤 그릇에 담을까?

# zip()은 짝짓기만 한 번, 결과를 담는 그릇만 다름
# · list(zip(...)) — 줄 세우기, 번호로 꺼냄: pairs[0]
# · dict(zip(...)) — 이름표 붙이기, 이름표로 꺼냄: person["이름"]
## 길이가 다르면 짧은 쪽 기준으로 끝남