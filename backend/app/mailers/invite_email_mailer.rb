class InviteEmailMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.invite_email_mailer.welcome.subject
  #
  def welcome(params)
    @greeting = "Hi"
    @user = User.find(params["id"])
    @password = params["password"]
    mail({
           :to => @user.email,
           :subject => 'Welcome to Exam seat allocation system',
           'Importance' => 'high',
           'X-Priority' => '1'})
  end
end
