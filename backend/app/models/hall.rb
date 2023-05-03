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
class Hall < ApplicationRecord
  has_one_attached :hall_file
end
