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
 * 공유 폴더 접근 권한 확인
 * "편집자" 권한이 있는지 확인합니다
 */
const checkSharedFolderPermission = async (
    accessToken: string, 
    sharedFolderId: string
): Promise<boolean> => {
    console.log('🔍 공유 폴더 권한 확인 중...')
    console.log('📁 폴더 ID:', sharedFolderId)
    
    try {
        // 폴더 정보 및 권한 확인
        const checkResponse = await fetch(
            `https://www.googleapis.com/drive/v3/files/${sharedFolderId}?fields=id,name,capabilities,permissions`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )
        
        if (!checkResponse.ok) {
            const error = await checkResponse.json()
            console.error('❌ 폴더 접근 불가:', error)
            throw new Error('공유 폴더에 접근할 수 없습니다. 폴더 링크와 권한을 확인하세요.')
        }
        
        const folderInfo = await checkResponse.json()
        console.log('📁 폴더 이름:', folderInfo.name)
        console.log('🔐 폴더 권한:', folderInfo.capabilities)
        
        // canAddChildren이 true면 파일 추가 가능
        if (folderInfo.capabilities?.canAddChildren) {
            console.log('✅ 공유 폴더에 쓰기 권한이 있습니다!')
            return true
        } else {
            console.error('❌ 공유 폴더에 쓰기 권한이 없습니다!')
            console.error('💡 해결 방법: 폴더 소유자가 "편집자" 권한을 설정해야 합니다.')
            throw new Error('공유 폴더에 쓰기 권한이 없습니다. 폴더 소유자에게 "편집자" 권한을 요청하세요.')
        }
    } catch (error) {
        console.error('❌ 권한 확인 실패:', error)
        throw error
    }
}

/**
 * Google Drive에 파일 업로드
 */
export const uploadToDrive = async (
    file: File,
    accessToken: string,
    folderId?: string
): Promise<{ id: string; name: string; webViewLink: string }> => {
    // 파일 유효성 검증
    const validation = validateFile(file)
    if (!validation.valid) {
        throw new Error(validation.error)
    }

    const fileExtension = file.name.split('.').pop()?.toUpperCase()
    const mimeType = fileExtension ? ALLOWED_MIME_TYPES[fileExtension] : file.type

    // 공유 폴더 ID 사용 (환경 변수에서 가져옴)
    let targetFolderId = folderId || process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID
    
    console.log('🎯 업로드 대상 폴더 ID:', targetFolderId)
    
    // 공유 폴더를 사용하는 경우, 먼저 접근 권한 확인
    if (targetFolderId) {
        try {
            await checkSharedFolderPermission(accessToken, targetFolderId)
        } catch (error: any) {
            // 권한 확인 실패 시 에러 던지기 (업로드 중단)
            console.error('❌ 공유 폴더 권한 확인 실패:', error)
            throw new Error(error.message || '공유 폴더에 접근할 수 없습니다. 폴더 소유자에게 "편집자" 권한을 요청하세요.')
        }
    } else {
        console.warn('⚠️ NEXT_PUBLIC_DRIVE_FOLDER_ID가 설정되지 않았습니다.')
        console.warn('⚠️ 각 사용자의 개인 드라이브 루트에 파일이 업로드됩니다.')
        console.warn('💡 중앙 공유 폴더에 업로드하려면 환경 변수를 설정하세요.')
    }

    // 메타데이터 설정
    const metadata: any = {
        name: file.name,
        mimeType: mimeType
    }
    
    // 폴더 ID가 있으면 해당 폴더에 저장
    if (targetFolderId) {
        metadata.parents = [targetFolderId]
        console.log('📁 메타데이터에 parents 설정:', targetFolderId)
    } else {
        console.warn('📁 parents 미설정 → 개인 드라이브 루트에 저장됨')
    }

    // FormData 생성
    const form = new FormData()
    form.append('metadata', new Blob([JSON.stringify(metadata)], {
        type: 'application/json'
    }))
    form.append('file', file)

    // Google Drive API로 업로드 (parents 필드 추가로 저장 위치 확인)
    const uploadResponse = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,parents',
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
        console.error('❌ 업로드 실패:', error)
        throw new Error(`업로드 실패: ${error.error?.message || '알 수 없는 오류'}`)
    }

    const uploadedFile = await uploadResponse.json()
    
    // 업로드 성공 로그 (실제 저장 위치 확인)
    console.log('✅ 파일 업로드 성공!')
    console.log('📄 파일 이름:', uploadedFile.name)
    console.log('🔗 링크:', uploadedFile.webViewLink)
    console.log('📁 저장된 폴더 ID:', uploadedFile.parents)
    console.log('🎯 원래 목표 폴더 ID:', targetFolderId)

    // 파일 공유 설정: "anyone with link can view"
    const permissionResponse = await fetch(
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

    if (permissionResponse.ok) {
        console.log('🔓 공유 권한 설정 완료 (anyone with link can view)')
    } else {
        console.warn('⚠️ 공유 권한 설정 실패 (파일은 업로드됨)')
    }

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

