import { Link } from 'react-router-dom'
import { isUpcoming, ddayLabel } from '../data/records.js'
import CategoryBadge from './CategoryBadge.jsx'
import StarRating from './StarRating.jsx'
import Poster from './Poster.jsx'

// 관람 기록 1건을 카드로 보여준다. 클릭하면 상세 페이지로 이동.
function RecordCard({ record }) {
  const upcoming = isUpcoming(record) // 아직 관람 전인가?

  return (
    <Link
      to={`/record/${record.id}`}
      className={upcoming ? 'card upcoming' : 'card'}
    >
      <div className="card-poster-wrap">
        {/* 포스터/현장 사진 (없으면 이모지로 대체) */}
        <Poster record={record} className="poster-card" />
        {/* 관람 전이면 D-day 뱃지 */}
        {upcoming && <span className="dday-badge">{ddayLabel(record)}</span>}
      </div>

      <div className="card-body">
        <CategoryBadge category={record.category} />
        <h3 className="card-title">{record.title}</h3>
        <p className="card-meta">
          {record.date} · {record.place}
        </p>

        {upcoming ? (
          // 관람 전: 별점 대신 예정 안내
          <p className="card-upcoming">🎫 관람 예정</p>
        ) : (
          <>
            <StarRating score={record.rating} />
            {record.reviewTitle && (
              <p className="card-review">“{record.reviewTitle}”</p>
            )}
          </>
        )}
      </div>
    </Link>
  )
}

export default RecordCard
