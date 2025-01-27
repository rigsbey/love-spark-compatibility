export const sendFeedbackEmail = async (feedback: string) => {
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        service_id: 'service_alrbm6a',
        template_id: 'template_uh9t6tw',
        user_id: 'BPXhgRofLupqeSc2c',
        template_params: {
          to_email: 'ab.kam@yandex.ru',
          subject: 'Совместимость в любви - отзывы пользователей',
          message: feedback,
          from_name: 'Пользователь сервиса',
          feedback_text: feedback,
          user_feedback: feedback
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Email service error:', errorData);
      throw new Error('Failed to send email');
    }

    return true;
  } catch (error) {
    console.error('Error sending feedback:', error);
    return false;
  }
}; 