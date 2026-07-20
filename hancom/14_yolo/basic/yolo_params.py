from ultralytics import YOLO
import cv2

# 1. 
model = YOLO('yolo11n.pt')

# 2. 모델 파라미터
model(
    "14_yolo\input_params.jpg", # 추론할 이미지 경로
    save=True,
    # conf=0.5,       # 신뢰도
    # max_det=3,      # 탐지할 최대 개수
    # sabe_crop=True, # 탐지된 객체 폴더 및 이미지 저장
    # save_txt=True,  # 좌표 텍스트저장
    # save_conf=True  # 신뢰도(confidence) 점수까지 함께 저장 / 주로 save_txt=True와 짝으로 동작 / 좌표 텍스트를 저장할 때 각 줄 끝에 confidence 값이 하나 더 붙음
    classes=[60, 75], # dining table이랑 vase 클래스만 탐지된 결과 이미지 저장
)

# 실습 => dining table, vase 클래스만 탐지된 결과 이미지가 나올 수 있도록