# 실습 : 거리에 따른 상태 조건을 출력해주세요 - 나

from ultralytics import solutions
import cv2

# 1. 비디오 경로 설정
stream_url = stream_url = "http://210.99.70.120:1935/live/cctv001.stream/playlist.m3u8"
cap = cv2.VideoCapture(stream_url)

# 2. 모델 로드 및 거리 계산 객체 생성
distance = solutions.DistanceCalculation(
    model = "yolo11n.pt",
    show = True
)

# 3. 프레임 처리 루프
while cap.isOpened():
    success, frame = cap.read()
    success = True
    if not success:
        print("프레임 읽기 실패")
        break

    # 3-1. 거리 계산 수행
    results = distance(frame)
    
    d = results.pixels_distance

    if not d:
        print("선택 안 됨")
    elif d <= 100:
        print("위험")
    else:
        print("안전")


# 4. 자원 해제
cap.release()


# 실습 : 거리에 따른 상태 조건을 출력해주세요.
