import { useParams, useNavigate, Link } from 'react-router-dom'
import { isUpcoming, ddayLabel, bookingSiteUrl } from '../data/records.js'
import { formatWon } from '../data/utils.js'
import CategoryBadge from '../components/CategoryBadge.jsx'
import StarRating from '../components/StarRating.jsx'
import Poster from '../components/Poster.jsx'

// 상세 페이지: URL의 :id로 기록 하나를 찾아서 크게 보여준다. 삭제 가능.
function Detail({ records, onDelete }) {
  const { id } = useParams() // URL 파라미터 (문자열)
  const navigate = useNavigate()

  // id로 기록 찾기 (URL 값은 문자열이라 Number로 변환해서 비교)
  const record = records.find((r) => r.id === Number(id))

  // 없는 id로 접근한 경우
  if (!record) {
    return (
      <div className="detail">
        <p className="empty">존재하지 않는 기록이에요.</p>
        <Link to="/" className="btn-primary">
          목록으로
        </Link>
      </div>
    )
  }

  const upcoming = isUpcoming(record) // 아직 관람 전인가?
  const siteUrl = bookingSiteUrl(record.bookingSite) // 예매처 링크 (없으면 null)

  const handleDelete = () => {
    if (window.confirm('이 기록을 삭제할까요?')) {
      onDelete(record.id)
      navigate('/') // 삭제 후 목록으로 이동
    }
  }

  return (
    <div className="detail">
      <div className="detail-poster-wrap">
        <Poster record={record} className="poster-detail" />
        {upcoming && <span className="dday-badge big">{ddayLabel(record)}</span>}
      </div>

      <div className="detail-body">
        <CategoryBadge category={record.category} />
        {upcoming && <span className="status-pill">관람 예정</span>}
        <h2>{record.title}</h2>
        {/* 관람 후에만 별점 표시 */}
        {!upcoming && <StarRating score={record.rating} />}

        <dl className="detail-info">
          <dt>관람일</dt>
          <dd>
            {record.date} {record.time}
          </dd>
          <dt>장소</dt>
          <dd>{record.place}</dd>
          <dt>좌석</dt>
          <dd>{record.seat || '-'}</dd>
        </dl>

        {/* 결제·예매 정보 */}
        <dl className="detail-info payment">
          <dt>결제일</dt>
          <dd>{record.bookedDate || '-'}</dd>
          <dt>결제수단</dt>
          <dd>{record.payMethod || '-'}</dd>
          <dt>예매처</dt>
          <dd>
            {siteUrl ? (
              <a
                href={siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="booking-link"
              >
                {record.bookingSite} ↗
              </a>
            ) : (
              record.bookingSite || '-'
            )}
          </dd>
          <dt>예매번호</dt>
          <dd>{record.bookingNo || '-'}</dd>
          <dt>금액</dt>
          <dd className="pay-amount">{formatWon(record.price)}</dd>
        </dl>

        {/* 감상: 관람 후에만 (관람 전이면 안내) */}
        {upcoming ? (
          <div className="detail-review upcoming-note">
            <p className="review-body">
              🎫 아직 관람 전이에요. 관람 후 감상을 남겨보세요!
            </p>
          </div>
        ) : (
          record.reviewTitle && (
            <div className="detail-review">
              <h3 className="review-title">“{record.reviewTitle}”</h3>
              <p className="review-body">{record.reviewBody}</p>
            </div>
          )
        )}

        <div className="detail-actions">
          <Link to="/" className="btn-ghost">
            ← 목록으로
          </Link>
          <div className="detail-buttons">
            <Link to={`/edit/${record.id}`} className="btn-edit">
              수정
            </Link>
            <button className="btn-danger" onClick={handleDelete}>
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Detail
