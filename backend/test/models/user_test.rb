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
require "test_helper"

class UserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
