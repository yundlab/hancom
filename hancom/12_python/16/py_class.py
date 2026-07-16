# ======
# 1. 클래스 : 제품의 설계도
# 2. 생성자 : 객에를 만들 때 실행되는 함수
# 3. 속성 : 클래스 안의 변수
# 4. 메서드 : 클래스 안의 함수
# 5. 객체 : 설계도로 만든 제품
# =====

# 클래스 정의
class World:
    # 생성자
    def __init__(self, name):
        # 속성
        self.name = name
        self.Time = time
    def hello(self):
        print(f"Hello, {self.name}!!")
    def world_time(self):
        print(f"Hello, {self.name}!!")
        
# 객체 생성
asia = World("Korea")

# 메서드 호출 1
asia.hello()
# Hello, Korea!!
