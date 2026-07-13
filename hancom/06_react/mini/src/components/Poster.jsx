import { useState } from 'react'
import { CATEGORIES } from '../data/records.js'

// 포스터/현장 사진을 보여준다.
// - image가 있으면 사진을 보여주고,
// - 없거나 사진 로딩에 실패하면 카테고리 색 + 이모지로 대체한다.
// className으로 크기(카드용/상세용/달력용)를 조절한다.
function Poster({ record, className = '' }) {
  const [broken, setBroken] = useState(false) // 이미지 깨졌는지 여부
  const meta = CATEGORIES[record.category]

  // 사진이 있고 아직 안 깨졌으면 <img>로 표시
  if (record.image && !broken) {
    return (
      <img
        src={record.image}
        alt={record.title}
        className={`poster ${className}`}
        loading="lazy"
        onError={() => setBroken(true)} // 실패하면 이모지로 폴백
      />
    )
  }

  // 폴백: 카테고리 색 배경 + 이모지
  return (
    <div
      className={`poster poster-emoji ${className}`}
      style={{ backgroundColor: meta.color }}
    >
      {record.poster}
    </div>
  )
}

export default Poster
