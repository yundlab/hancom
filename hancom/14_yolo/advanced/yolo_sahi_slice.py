from sahi.predict import get_sliced_prediction
from sahi import AutoDetectionModel

# 1. 모델 경로
model_path = "yolo11n.pt"

# 2. 모델 로드
detection_model = AutoDetectionModel.from_pretrained(
    model_type="ultralytics",
    model_path=model_path,
    confidence_threshold=0.4
)

# 3. SAHI 적용
results = get_sliced_prediction(
    "14_yolo/advanced/demo_data/image_1.png",
    detection_model,
    slice_width=200,               # 타일 너비
    slice_height=200,              # 타일 높이    
    overlap_width_ratio=0.1,       # 가로 겹침
    overlap_height_ratio=0.1,      # 세로 겹침
)

# 4. 결과 시각화 및 저장
results.export_visuals(export_dir="sahi/")

# 5. 탐지 개수 출력
print(f"탐지 수 : {results.object_prediction_list}")
print("모든 코드가 잘 실행됐습니다.")