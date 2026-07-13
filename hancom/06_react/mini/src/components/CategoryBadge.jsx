import { CATEGORIES } from '../data/records.js'

// 카테고리 이름을 받아서 이모지 + 색상 뱃지로 보여준다.
function CategoryBadge({ category }) {
  const meta = CATEGORIES[category]

  return (
    <span className="badge" style={{ backgroundColor: meta.color }}>
      {meta.emoji} {category}
    </span>
  )
}

export default CategoryBadge
