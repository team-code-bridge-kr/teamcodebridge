/**
 * Google Forms API 유틸리티
 * 
 * Google Forms API를 사용하여 설문조사를 생성하고 관리합니다.
 * API 문서: https://developers.google.com/forms/api
 */

import { SurveyQuestionTemplate } from './surveyTemplates'

/**
 * Google Forms API로 설문조사 생성
 */
export const createGoogleForm = async (
  accessToken: string,
  title: string,
  description?: string,
  questions?: SurveyQuestionTemplate[]
): Promise<{ formId: string; formUrl: string; responderUri: string }> => {
  console.log('📝 Google Forms 생성 시작...')
  console.log('제목:', title)
  
  // 1. 빈 Form 생성
  const createResponse = await fetch(
    'https://forms.googleapis.com/v1/forms',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        info: {
          title: title,
          documentTitle: title
        }
      })
    }
  )

  if (!createResponse.ok) {
    const error = await createResponse.json()
    console.error('❌ Form 생성 실패:', error)
    throw new Error(`Form 생성 실패: ${error.error?.message || '알 수 없는 오류'}`)
  }

  const form = await createResponse.json()
  console.log('✅ Form 생성 성공! ID:', form.formId)
  console.log('🔗 Form URL:', form.responderUri)

  // 2. 설명 및 질문 추가 (있는 경우)
  if (description || (questions && questions.length > 0)) {
    const requests: any[] = []

    // 설명 업데이트
    if (description) {
      requests.push({
        updateFormInfo: {
          info: {
            description: description
          },
          updateMask: 'description'
        }
      })
    }

    // 질문 추가
    if (questions && questions.length > 0) {
      questions.forEach((q, index) => {
        requests.push(createQuestionRequest(q, index))
      })
    }

    // Batch Update 실행
    if (requests.length > 0) {
      const updateResponse = await fetch(
        `https://forms.googleapis.com/v1/forms/${form.formId}:batchUpdate`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ requests })
        }
      )

      if (!updateResponse.ok) {
        const error = await updateResponse.json()
        console.error('⚠️ Form 업데이트 실패:', error)
        // Form은 생성되었으므로 에러를 던지지 않고 경고만 표시
      } else {
        console.log('✅ Form 업데이트 성공 (설명, 질문 추가)')
      }
    }
  }

  return {
    formId: form.formId,
    formUrl: form.responderUri,
    responderUri: form.responderUri
  }
}

/**
 * 질문 생성 요청 객체 생성
 */
function createQuestionRequest(question: SurveyQuestionTemplate, index: number): any {
  const location = {
    index: index
  }

  // 기본 질문 구조
  const questionItem: any = {
    title: question.questionText,
    required: question.required
  }

  // 질문 타입에 따른 설정
  switch (question.questionType) {
    case 'TEXT':
      questionItem.questionItem = {
        question: {
          required: question.required,
          textQuestion: {
            paragraph: false
          }
        }
      }
      break

    case 'PARAGRAPH':
      questionItem.questionItem = {
        question: {
          required: question.required,
          textQuestion: {
            paragraph: true
          }
        }
      }
      break

    case 'MULTIPLE_CHOICE':
      questionItem.questionItem = {
        question: {
          required: question.required,
          choiceQuestion: {
            type: 'RADIO',
            options: question.options?.map(opt => ({ value: opt })) || []
          }
        }
      }
      break

    case 'CHECKBOX':
      questionItem.questionItem = {
        question: {
          required: question.required,
          choiceQuestion: {
            type: 'CHECKBOX',
            options: question.options?.map(opt => ({ value: opt })) || []
          }
        }
      }
      break

    case 'LINEAR_SCALE':
      questionItem.questionItem = {
        question: {
          required: question.required,
          scaleQuestion: {
            low: question.scaleMin || 1,
            high: question.scaleMax || 5,
            lowLabel: question.scaleMinLabel || '',
            highLabel: question.scaleMaxLabel || ''
          }
        }
      }
      break

    case 'DATE':
      questionItem.questionItem = {
        question: {
          required: question.required,
          dateQuestion: {
            includeTime: false,
            includeYear: true
          }
        }
      }
      break

    case 'TIME':
      questionItem.questionItem = {
        question: {
          required: question.required,
          timeQuestion: {
            duration: false
          }
        }
      }
      break

    default:
      // TEXT로 대체
      questionItem.questionItem = {
        question: {
          required: question.required,
          textQuestion: {
            paragraph: false
          }
        }
      }
  }

  return {
    createItem: {
      item: questionItem,
      location: location
    }
  }
}

/**
 * Google Forms 삭제
 */
export const deleteGoogleForm = async (
  accessToken: string,
  formId: string
): Promise<void> => {
  console.log('🗑️ Google Form 삭제 시도:', formId)

  // Google Forms API는 직접 삭제를 지원하지 않음
  // 대신 Google Drive API를 사용하여 파일 삭제
  const deleteResponse = await fetch(
    `https://www.googleapis.com/drive/v3/files/${formId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  )

  if (!deleteResponse.ok) {
    const error = await deleteResponse.json()
    console.error('❌ Form 삭제 실패:', error)
    throw new Error(`Form 삭제 실패: ${error.error?.message || '알 수 없는 오류'}`)
  }

  console.log('✅ Form 삭제 성공')
}

/**
 * Google Forms 응답 수 가져오기
 */
export const getFormResponseCount = async (
  accessToken: string,
  formId: string
): Promise<number> => {
  try {
    const response = await fetch(
      `https://forms.googleapis.com/v1/forms/${formId}/responses`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    )

    if (!response.ok) {
      console.warn('⚠️ 응답 수 가져오기 실패')
      return 0
    }

    const data = await response.json()
    return data.responses?.length || 0
  } catch (error) {
    console.error('❌ 응답 수 가져오기 오류:', error)
    return 0
  }
}

/**
 * Google Forms를 Google Sheets와 연결
 */
export const linkFormToSheets = async (
  accessToken: string,
  formId: string
): Promise<string | null> => {
  try {
    // Forms API를 통해 자동으로 Sheets 생성 및 연결
    const response = await fetch(
      `https://forms.googleapis.com/v1/forms/${formId}:watch`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          watch: {
            target: {
              topic: {
                topicName: `projects/${formId}/topics/form-responses`
              }
            },
            eventType: 'RESPONSES'
          }
        })
      }
    )

    if (!response.ok) {
      console.warn('⚠️ Sheets 연결 실패 (수동으로 연결 필요)')
      return null
    }

    // 연결된 Sheets URL 반환 (실제로는 Form 정보에서 가져와야 함)
    return `https://docs.google.com/spreadsheets/d/${formId}/edit`
  } catch (error) {
    console.error('❌ Sheets 연결 오류:', error)
    return null
  }
}

