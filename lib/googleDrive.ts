/**
 * Google Drive API 유틸리티
 * 
 * 보안 고려사항:
 * - 파일은 팀코드브릿지 전용 폴더에만 업로드
 * - 파일 크기 제한: 100MB
 * - 허용된 파일 타입만 업로드
 * - 공유 권한: "anyone with link can view"로 제한
 */

// 허용된 MIME 타입
const ALLOWED_MIME_TYPES: { [key: string]: string } = {
    // 문서
    'PDF': 'application/pdf',
    'DOCX': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'TXT': 'text/plain',
    'HTML': 'text/html',
    
    // 프레젠테이션
    'PPT': 'application/vnd.ms-powerpoint',
    'PPTX': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    
    // 스프레드시트
    'XLSX': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    
    // 압축
    'ZIP': 'application/zip',
    
    // 미디어
    'MP4': 'video/mp4',
    'MP3': 'audio/mpeg',
    'PNG': 'image/png',
    'JPG': 'image/jpeg',
    'JPEG': 'image/jpeg',
}

// 최대 파일 크기: 100MB
const MAX_FILE_SIZE = 100 * 1024 * 1024

/**
 * 파일 유효성 검증
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `파일 크기가 너무 큽니다. 최대 100MB까지 업로드 가능합니다. (현재: ${(file.size / 1024 / 1024).toFixed(2)}MB)`
        }
    }

    // 파일 타입 검증
    const fileExtension = file.name.split('.').pop()?.toUpperCase()
    if (!fileExtension || !ALLOWED_MIME_TYPES[fileExtension]) {
        return {
            valid: false,
            error: `지원하지 않는 파일 형식입니다. 허용된 형식: ${Object.keys(ALLOWED_MIME_TYPES).join(', ')}`
        }
    }

    return { valid: true }
}

/**
 * 파일 크기를 읽기 쉬운 형식으로 변환
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Google Drive에 파일 업로드
 */
export const uploadToDrive = async (
    file: File,
    accessToken: string,
    folderId: string = process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID || ''
): Promise<{ id: string; name: string; webViewLink: string }> => {
    // 파일 유효성 검증
    const validation = validateFile(file)
    if (!validation.valid) {
        throw new Error(validation.error)
    }

    const fileExtension = file.name.split('.').pop()?.toUpperCase()
    const mimeType = fileExtension ? ALLOWED_MIME_TYPES[fileExtension] : file.type

    // 메타데이터 설정
    const metadata = {
        name: file.name,
        mimeType: mimeType,
        parents: [folderId] // 팀코드브릿지 전용 폴더에 저장
    }

    // FormData 생성
    const form = new FormData()
    form.append('metadata', new Blob([JSON.stringify(metadata)], {
        type: 'application/json'
    }))
    form.append('file', file)

    // Google Drive API로 업로드
    const uploadResponse = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            body: form
        }
    )

    if (!uploadResponse.ok) {
        const error = await uploadResponse.json()
        throw new Error(`업로드 실패: ${error.error?.message || '알 수 없는 오류'}`)
    }

    const uploadedFile = await uploadResponse.json()

    // 파일 공유 설정: "anyone with link can view"
    await fetch(
        `https://www.googleapis.com/drive/v3/files/${uploadedFile.id}/permissions`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                role: 'reader',
                type: 'anyone'
            })
        }
    )

    return uploadedFile
}

/**
 * Google Picker 초기화 (파일 선택 UI)
 */
export const initializePicker = (
    accessToken: string,
    callback: (data: any) => void
): void => {
    // @ts-ignore - Google Picker 글로벌 객체
    const google = window.google

    if (!google || !google.picker) {
        console.error('Google Picker API가 로드되지 않았습니다.')
        return
    }

    const picker = new google.picker.PickerBuilder()
        .addView(new google.picker.DocsView()
            .setParent(process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID || '')
            .setIncludeFolders(true))
        .setOAuthToken(accessToken)
        .setDeveloperKey(process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '')
        .setCallback(callback)
        .build()

    picker.setVisible(true)
}

/**
 * 파일 타입에서 확장자 추출
 */
export const getFileExtension = (fileName: string): string => {
    return fileName.split('.').pop()?.toUpperCase() || 'ETC'
}

