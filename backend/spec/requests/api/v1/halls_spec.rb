require 'swagger_helper'

RSpec.describe 'api/v1/halls', type: :request do

  path '/api/v1/halls' do

    get('list halls') do
      tags 'Halls'
      consumes 'application/json'
      response(200, 'successful') do
        examples 'application/json' => {
          "halls": [
            {
              "id": "4bbfa444-df6f-40dc-8558-7edbef8f8a6a",
              "name": "CPE hall 1",
              "capacity": 40,
              "row_length": 3,
              "department": "Computer Engineering",
              "bad_seats": [
                3,
                35
              ]
            }
          ]
        }
        after do |example|
          example.metadata[:response][:content] = {
            'application/json' => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
        end
        run_test!
      end
    end

    post('create hall') do
      tags 'Halls'
      consumes 'multipart/form-data'
      parameter in: :formData, schema: {
        type: :object,
        properties: {
          name: { type: :string, example: 'CPE hall 1' },
          capacity: { type: :integer, example: 40 },
          department: { type: :string, example: 'Computer Engineering' },
          hall_file: { type: :string, format: :binary, description: 'hall file' },
        },
        required: %w[name capacity  department hall_file]
      }
      response(200, 'successful') do
        examples 'application/json' => {
          "id": "4bbfa444-df6f-40dc-8558-7edbef8f8a6a",
          "name": "CPE hall 1",
          "capacity": 40,
          "row_length": 3,
          "department": "Computer Engineering",
          "bad_seats": [
            3,
            35
          ]
        }
        after do |example|
          example.metadata[:response][:content] = {
            'application/json' => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
        end
        run_test!
      end
    end

    # delete('delete hall') do
    #   tags 'Halls'
    #   consumes 'application/json'
    #   parameter name: :id, in: :path, type: :string
    #   response(204, 'successful') do
    #     after do |example|
    #       example.metadata[:response][:content] = {
    #         'application/json' => {
    #           example: JSON.parse(response.body, symbolize_names: true)
    #         }
    #       }
    #     end
    #     run_test!
    #   end
    # end
  end

  path '/api/v1/halls/{id}' do
    # You'll want to customize the parameter types...
    parameter name: 'id', in: :path, type: :string, description: 'id'
    delete('delete hall') do
      tags 'Halls'
      response(200, 'successful') do
        let(:id) { '123' }

        after do |example|
          example.metadata[:response][:content] = {
            'application/json' => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
        end
        run_test!
      end
    end
  end
end
