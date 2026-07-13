import { CATEGORY_LIST } from '../data/records.js'

// 카테고리 필터 탭. '전체' + 각 카테고리 버튼.
// current: 현재 선택된 값, onChange: 클릭 시 상위로 알려주는 함수
function FilterBar({ current, onChange }) {
  // '전체'를 맨 앞에 붙인 목록
  const tabs = ['전체', ...CATEGORY_LIST]

  return (
    <div className="filter-bar">
      {tabs.map((tab) => (
        <button
          key={tab}
          // 현재 선택된 탭이면 active 클래스 추가
          className={current === tab ? 'filter-tab active' : 'filter-tab'}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

export default FilterBar
