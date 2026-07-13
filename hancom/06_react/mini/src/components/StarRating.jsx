// 별점(1~5)을 받아서 채워진 별 / 빈 별로 보여준다.
function StarRating({ score }) {
  const stars = []

  for (let i = 1; i <= 5; i++) {
    // i가 점수보다 작거나 같으면 채운 별, 아니면 빈 별
    stars.push(i <= score ? '★' : '☆')
  }

  return <span className="stars">{stars.join('')}</span>
}

export default StarRating
