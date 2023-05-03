# == Schema Information
#
# Table name: users
#
#  id              :uuid             not null, primary key
#  age             :integer
#  email           :string           not null
#  first_name      :string           not null
#  gender          :string
#  last_name       :string           not null
#  password_digest :string           not null
#  role            :integer          default("user")
#  status          :integer          default("active")
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
class User < ApplicationRecord

  has_secure_password :validations => false

  validates_presence_of :first_name, :last_name, :email

  enum role: [:user, :admin, :superadmin, :developer]
  enum status: [:active, :inactive]


  def deactivate
    self.status = 'inactive'
    self.save
  end

  def activate
    self.status = 'active'
    self.save
  end
end
