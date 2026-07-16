# 기본 구조 - 비가 오면 우산 챙기기
is_raining = True           # 비가 오는가?

if is_raining :
    print("우산을 챙겨요!")
else: 
    print("우산 없어도 돼요.")
# 우산을 챙겨요!

is_raining = False           # 비가 오는가?

if is_raining :
    print("우산을 챙겨요!")
else: 
    print("우산 없어도 돼요.")
# 우산 없어도 돼요.


# ELIF 활용 - 오늘 기온에 따른 옷차림
temperature = 28
if temperature >=30:
    print("덥다! 반팔 입기")
elif temperature >=20:
    print("딱 좋아! 가볍게 입기")
elif temperature >= 10:
    print("쌀쌀해요. 겉옷 챙기기")
else:
    print("추워! 코트 입기!")
# 딱 좋아! 가볍게 입기