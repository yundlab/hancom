# 실습 : 거리에 따른 상태 조건을 출력해주세요 - 강사님

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
    if not success:
        print("프레임 읽기 실패")
        break

    # 3-1. 거리 계산 수행
    # result = distance(frame)
    results = distance.process(frame)

    # 3-2. pixels_distance 추출
    pixel_distance = results.pixels_distance

    # 3-3. 거리 계산 측정 안됐을 때
    if pixel_distance is None or pixel_distance == 0:
        print("[거리] ---px [상태] 입력 안됨")
        continue

    # 3-4. 거리 계산에 따른 상태 정의
    if pixel_distance >= 150:
        status = "Safe"
    elif pixel_distance >= 100:
        status = "Warning"
    else:
        status = "Danger"

    # 3-5. 상태 출력
    print(f"{pixel_distance}px 상태 => {status}")

# 4. 자원 해제
cap.release()
