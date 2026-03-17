import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { fullName, phone, service, notes } = data;

    // Send email to Admin
    const { data: emailData, error } = await resend.emails.send({
      from: 'Meret Health <onboarding@resend.dev>', // Should use verified domain in production
      to: 'lenguyen2101@gmail.com',
      subject: `[Yêu cầu đặt lịch] ${fullName} - ${phone}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #0f2a3d;">
          <h2 style="color: #d4af37; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">Yêu cầu đặt lịch mới</h2>
          <p><strong>Họ và tên:</strong> ${fullName}</p>
          <p><strong>Số điện thoại:</strong> ${phone}</p>
          <p><strong>Dịch vụ quan tâm:</strong> ${service || 'Không chọn'}</p>
          <p><strong>Ghi chú:</strong> ${notes || 'Không có'}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #718096;">Gửi từ hệ thống website Meret Health</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return new Response(JSON.stringify({ error }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, emailData }), { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
