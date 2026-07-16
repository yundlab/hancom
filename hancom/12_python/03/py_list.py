colors = ['red', 'green', 'blue']
# 순서 있음, 수정 가능, 중복 허용

# 인덱싱 & 슬라이싱
print(colors[0])
# red   (첫 번째)
print(colors[-1])
# blue  (마지막)
print(colors[1:3])
# ['red', 'green']  (슬라이싱 / a:b a번부터 시작, 처음에서 b번째 까지)

# 값 변경 & 주요 메서드
colors[-1] = 'black'
print(colors[-1])
# black                                         값 변경

colors.append('pink')
print(colors)
# ['red', 'green', 'black', 'pink']             끝에 추가

colors.insert(3, 'white')
print(colors)
# ['red', 'green', 'black', 'white', 'pink']    특정 위치에 삽입

colors.remove('red')
print(colors)
# ['green', 'black', 'white', 'pink']           값으로 제거



numbers = [8, 5, 3, 2, 7]

numbers.sort()
print(numbers)
# [2, 3, 5, 7, 8]                               오름차순 정렬

numbers.sort(reverse=True)
print(numbers)
# [8, 7, 5, 3, 2]                               내림차순 정렬

print(2 in numbers)                             
# True                                          포함 여부(2가 포함인지)

print(9 in numbers)
# False                                         포함 여부(9가 포함인지)