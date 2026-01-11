import nodemailer from 'nodemailer'

// SMTP 설정 (Mailcow 기준)
// mail.teamcodebridge.dev 메일 서버 사용
const createTransporter = () => {
    // Mailcow SMTP 설정:
    // - 호스트: mail.teamcodebridge.dev
    // - 포트: 587 (STARTTLS)
    // - 사용자 이름: noreply@teamcodebridge.dev
    // - 비밀번호: [계정 비밀번호]
    
    const host = process.env.SMTP_HOST || 'mail.teamcodebridge.dev'
    const port = parseInt(process.env.SMTP_PORT || '587')
    const isSecure = process.env.SMTP_SECURE === 'true' || port === 465
    
    return nodemailer.createTransport({
        host: host,
        port: port,
        secure: isSecure, // 포트 465면 true, 587이면 false
        auth: {
            user: process.env.SMTP_USER || 'noreply@teamcodebridge.dev',
            pass: process.env.SMTP_PASS || '',
        },
        tls: {
            rejectUnauthorized: false, // 자체 인증서 허용
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
            from: `"TeamCodeBridge" <${process.env.SMTP_USER || 'noreply@teamcodebridge.dev'}>`,
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

// 로그인 환영 메일
export const sendWelcomeEmail = async (
    userName: string,
    userEmail: string
) => {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .welcome-box { background: #dbeafe; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #3b82f6; text-align: center; }
                .button { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 환영합니다!</h1>
                </div>
                <div class="content">
                    <div class="welcome-box">
                        <h2 style="margin: 0; color: #1e40af;">로그인되었습니다!</h2>
                        <p style="margin: 10px 0 0 0; font-size: 16px;">TeamCodeBridge 워크스페이스에 오신 것을 환영합니다</p>
                    </div>
                    
                    <p>안녕하세요, <strong>${userName}</strong>님!</p>
                    <p><strong>${userEmail}</strong> 계정으로 성공적으로 로그인하셨습니다.</p>
                    
                    <p style="margin-top: 20px;">TeamCodeBridge에서 다음과 같은 기능을 사용하실 수 있습니다:</p>
                    <ul style="line-height: 1.8;">
                        <li>📋 프로젝트 및 업무 관리</li>
                        <li>💬 실시간 채팅</li>
                        <li>📅 캘린더 및 회의 일정 관리</li>
                        <li>📚 커리큘럼 및 교재 관리</li>
                        <li>📊 만족도 조사</li>
                    </ul>
                    
                    <p style="text-align: center;">
                        <a href="${process.env.NEXTAUTH_URL || 'https://e2g.teamcodebridge.dev'}/workspace" class="button">워크스페이스로 이동</a>
                    </p>
                </div>
                <div class="footer">
                    <p>TeamCodeBridge 워크스페이스</p>
                    <p>이 메일은 로그인 확인용 자동 발송 메일입니다.</p>
                </div>
            </div>
        </body>
        </html>
    `

    return await sendEmail({
        to: userEmail,
        subject: '[TeamCodeBridge] 로그인되었습니다 🎉',
        html,
    })
}

