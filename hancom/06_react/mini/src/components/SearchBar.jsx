// 제목 검색 입력창 (목록/예매 알리미에서 공용).
// value: 현재 검색어, onChange: 검색어를 문자열로 넘겨주는 함수
function SearchBar({ value, onChange, placeholder = '제목으로 검색' }) {
  return (
    <div className="search-bar">
      <span className="search-icon" aria-hidden="true">
        🔍
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  )
}

export default SearchBar
