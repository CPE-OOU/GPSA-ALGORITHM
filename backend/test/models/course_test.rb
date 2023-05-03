# == Schema Information
#
# Table name: courses
#
#  id         :uuid             not null, primary key
#  code       :string           not null
#  department :string
#  lecturer   :string
#  level      :integer
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require "test_helper"

class CourseTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
