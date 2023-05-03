# == Schema Information
#
# Table name: halls
#
#  id         :uuid             not null, primary key
#  bad_seats  :integer          default([]), is an Array
#  capacity   :integer
#  department :string
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require "test_helper"

class HallTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
