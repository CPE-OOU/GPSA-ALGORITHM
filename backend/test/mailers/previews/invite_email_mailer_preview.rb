# Preview all emails at http://localhost:3000/rails/mailers/invite_email_mailer
class InviteEmailMailerPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/invite_email_mailer/welcome
  def welcome
    InviteEmailMailer.welcome
  end

end
