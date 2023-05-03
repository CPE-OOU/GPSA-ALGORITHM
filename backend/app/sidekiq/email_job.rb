class EmailJob
  include Sidekiq::Job

  def perform(params)
    InviteEmailMailer.welcome(params).deliver_now
  end
end
