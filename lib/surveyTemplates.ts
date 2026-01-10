/**
 * 만족도 조사 추천 설문 템플릿
 * TeamCodeBridge에서 기본적으로 사용하는 설문 항목
 */

export interface SurveyQuestionTemplate {
  order: number
  questionText: string
  questionType: 'TEXT' | 'PARAGRAPH' | 'MULTIPLE_CHOICE' | 'CHECKBOX' | 'LINEAR_SCALE' | 'DATE' | 'TIME' | 'EMAIL' | 'PHONE'
  required: boolean
  options?: string[]
  scaleMin?: number
  scaleMax?: number
  scaleMinLabel?: string
  scaleMaxLabel?: string
}

export const RECOMMENDED_SURVEY_TEMPLATE: SurveyQuestionTemplate[] = [
  {
    order: 1,
    questionText: '개인정보 수집 및 이용에 동의하십니까?\n\n수집 목적: 설문 응답 분석 및 상품 증정\n수집 항목: 이메일, 전화번호\n보유 기간: 설문 종료 후 3개월',
    questionType: 'MULTIPLE_CHOICE',
    required: true,
    options: ['동의합니다', '동의하지 않습니다']
  },
  {
    order: 2,
    questionText: '중복 방지를 위한 이메일을 입력해주세요.',
    questionType: 'EMAIL',
    required: true
  },
  {
    order: 3,
    questionText: '상품 증정을 위한 전화번호를 입력해주세요. (예: 010-1234-5678)',
    questionType: 'PHONE',
    required: true
  },
  {
    order: 4,
    questionText: '프로그램 구성은 적절하였나요?',
    questionType: 'LINEAR_SCALE',
    required: true,
    scaleMin: 1,
    scaleMax: 5,
    scaleMinLabel: '매우 부적절',
    scaleMaxLabel: '매우 적절'
  },
  {
    order: 5,
    questionText: '전반적인 프로그램 만족도를 남겨주세요.',
    questionType: 'LINEAR_SCALE',
    required: true,
    scaleMin: 1,
    scaleMax: 5,
    scaleMinLabel: '매우 불만족',
    scaleMaxLabel: '매우 만족'
  },
  {
    order: 6,
    questionText: '차후 프로그램에 재참여하고 싶나요?',
    questionType: 'LINEAR_SCALE',
    required: true,
    scaleMin: 1,
    scaleMax: 5,
    scaleMinLabel: '전혀 아니다',
    scaleMaxLabel: '매우 그렇다'
  },
  {
    order: 7,
    questionText: '멘토의 피드백은 적절하였나요?',
    questionType: 'LINEAR_SCALE',
    required: true,
    scaleMin: 1,
    scaleMax: 5,
    scaleMinLabel: '매우 부적절',
    scaleMaxLabel: '매우 적절'
  },
  {
    order: 8,
    questionText: '이번 프로젝트를 통해 얻게 된 점이 있다면 자유롭게 적어주세요!',
    questionType: 'PARAGRAPH',
    required: true
  },
  {
    order: 9,
    questionText: '프로그램에 대해서 아쉬웠던 점이나 개선이 필요한 점을 자유롭게 적어주세요!',
    questionType: 'PARAGRAPH',
    required: true
  },
  {
    order: 10,
    questionText: '담당 멘토님께 남기고 싶은 말을 자유롭게 작성해주세요.',
    questionType: 'PARAGRAPH',
    required: true
  },
  {
    order: 11,
    questionText: '[선택] 더 자세한 의견을 들려주실 수 있다면 이메일 또는 연락처를 남겨주세요.\n활동 프로그램 개선을 위한 가벼운 인터뷰를 요청드리고 싶습니다.',
    questionType: 'TEXT',
    required: false
  }
]

/**
 * 질문 타입 라벨 매핑
 */
export const QUESTION_TYPE_LABELS: Record<string, string> = {
  'TEXT': '단답형',
  'PARAGRAPH': '장문형',
  'MULTIPLE_CHOICE': '객관식 (단일 선택)',
  'CHECKBOX': '체크박스 (다중 선택)',
  'LINEAR_SCALE': '선형 배율 (1-5점)',
  'DATE': '날짜',
  'TIME': '시간',
  'EMAIL': '이메일',
  'PHONE': '전화번호'
}

/**
 * 질문 타입별 아이콘
 */
export const QUESTION_TYPE_ICONS: Record<string, string> = {
  'TEXT': '📝',
  'PARAGRAPH': '📄',
  'MULTIPLE_CHOICE': '🔘',
  'CHECKBOX': '☑️',
  'LINEAR_SCALE': '📊',
  'DATE': '📅',
  'TIME': '⏰',
  'EMAIL': '📧',
  'PHONE': '📞'
}

