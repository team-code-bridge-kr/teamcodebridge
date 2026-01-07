import nodemailer from 'nodemailer'

// SMTP 설정 (sogo mail 기준)
// sogo mail "발신자 의존 전송" 설정에서 입력한 값을 환경 변수로 사용
const createTransporter = () => {
    // sogo mail 발신자 의존 전송 설정:
    // - 호스트: smtp.sogo.co.kr:587 (또는 mail.sogo.co.kr:587)
    // - 사용자 이름: support@teamcodebridge.dev
    // - 비밀번호: [계정 비밀번호 또는 앱 비밀번호]
    
    const host = process.env.SMTP_HOST || 'smtp.sogo.co.kr'
    const port = parseInt(process.env.SMTP_PORT || '587')
    const isSecure = process.env.SMTP_SECURE === 'true' || port === 465
    
    return nodemailer.createTransport({
        host: host, // 발신자 의존 전송의 "호스트"에서 포트 제외 (예: smtp.sogo.co.kr)
        port: port, // 발신자 의존 전송의 "호스트"에 포함된 포트 (예: 587)
        secure: isSecure, // 포트 465면 true, 587이면 false
        auth: {
            user: process.env.SMTP_USER || 'support@teamcodebridge.dev', // 발신자 의존 전송의 "사용자 이름"
            pass: process.env.SMTP_PASS || '', // 발신자 의존 전송의 "비밀번호"
        },
        tls: {
            rejectUnauthorized: false, // sogo mail 인증서 검증 우회 (필요시)
        },
    })
}

interface EmailOptions {
    to: string | string[]
    subject: string
    html: string
    text?: string
}

export const sendEmail = async ({ to, subject, html, text }: EmailOptions) => {
    try {
        const transporter = createTransporter()
        
        const mailOptions = {
            from: `"TeamCodeBridge" <${process.env.SMTP_USER || 'support@teamcodebridge.dev'}>`,
            to: Array.isArray(to) ? to.join(', ') : to,
            subject,
            text: text || html.replace(/<[^>]*>/g, ''), // HTML 태그 제거한 텍스트 버전
            html,
        }

        const info = await transporter.sendMail(mailOptions)
        console.log('Email sent:', info.messageId)
        return { success: true, messageId: info.messageId }
    } catch (error) {
        console.error('Error sending email:', error)
        return { success: false, error }
    }
}

// 회의 일정 투표 생성 알림
export const sendPollCreatedEmail = async (
    pollTitle: string,
    pollDescription: string | null,
    creatorName: string,
    recipientEmails: string[]
) => {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📅 새로운 회의 일정 투표</h1>
                </div>
                <div class="content">
                    <h2>${pollTitle}</h2>
                    ${pollDescription ? `<p>${pollDescription}</p>` : ''}
                    <p><strong>작성자:</strong> ${creatorName}</p>
                    <p>회의 일정에 대한 투표가 생성되었습니다. 가능한 날짜와 시간에 투표해주세요.</p>
                    <a href="${process.env.NEXTAUTH_URL || 'https://e2g.teamcodebridge.dev'}/workspace/meetings" class="button">투표하기</a>
                </div>
                <div class="footer">
                    <p>TeamCodeBridge 워크스페이스</p>
                </div>
            </div>
        </body>
        </html>
    `

    return await sendEmail({
        to: recipientEmails,
        subject: `[TeamCodeBridge] 새로운 회의 일정 투표: ${pollTitle}`,
        html,
    })
}

// 회의 일정 확정 알림
export const sendPollFinalizedEmail = async (
    pollTitle: string,
    selectedDate: string,
    selectedTime: string,
    recipientEmails: string[]
) => {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .highlight { background: #d1fae5; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #10b981; }
                .button { display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✅ 회의 일정이 확정되었습니다</h1>
                </div>
                <div class="content">
                    <h2>${pollTitle}</h2>
                    <div class="highlight">
                        <p style="margin: 0; font-size: 18px; font-weight: bold;">📅 확정된 일정</p>
                        <p style="margin: 10px 0 0 0; font-size: 16px;">${selectedDate} ${selectedTime}</p>
                    </div>
                    <p>회의 일정이 확정되었습니다. 일정을 확인하고 참석 가능 여부를 알려주세요.</p>
                    <a href="${process.env.NEXTAUTH_URL || 'https://e2g.teamcodebridge.dev'}/workspace/meetings" class="button">일정 확인하기</a>
                </div>
                <div class="footer">
                    <p>TeamCodeBridge 워크스페이스</p>
                </div>
            </div>
        </body>
        </html>
    `

    return await sendEmail({
        to: recipientEmails,
        subject: `[TeamCodeBridge] 회의 일정 확정: ${pollTitle}`,
        html,
    })
}

