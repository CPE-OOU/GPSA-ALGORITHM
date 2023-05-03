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
class Course < ApplicationRecord
  has_one_attached :course_file

  enum level: {
    "200": 0,
    "300": 1,
    "400": 2,
    "500": 3
  }
end
