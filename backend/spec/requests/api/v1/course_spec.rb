require 'swagger_helper'

RSpec.describe 'api/v1/course', type: :request do

  path '/api/v1/course' do

    get('list courses') do
      tags 'courses'
      consumes 'application/json'
      response(200, 'successful') do
        examples 'application/json' => {
          courses: [
            {
              "id": "f943ce6d-fc08-404c-9337-54284ceeae07",
              "name": "Mechanical Design",
              "level": "500",
              "lecturer": "Mr Oyedeji",
              "code": "MEG-502",
              "created_at": "2022-11-01 07:21:41 UTC",
              "updated_at": "2022-11-01 07:21:41 UTC",
              "file": {
                "url": "http://localhost:3000/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaWszTkdReE9UbGtaQzFsT1RRekxUUTNPRE10T0dRMFppMWlNRFkzTkdNeE56YzFPRElHT2daRlZBPT0iLCJleHAiOm51bGwsInB1ciI6ImJsb2JfaWQifX0=--fd65f9031eb81ef45573a353d8302b41d2588c44/MEG502_RAIN_REG_LIST_1666787342.csv"
              }
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

    post('create course') do
      tags 'courses'
      consumes 'multipart/form-data'
      produces 'application/json'
      parameter in: :formData, schema: {
        type: :object,
        properties: {
          name: { type: :string, description: 'course name' },
          level: { type: :string, description: 'course level' },
          lecturer: { type: :string, description: 'course lecturer' },
          code: { type: :string, description: 'course code' },
          course_file: { type: :string, format: :binary, description: 'course file' }
        },
        required: %w[name level lecturer code course_file]
      }
      response(200, 'successful') do

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
    delete('delete course') do
      tags 'courses'
      consumes 'application/json'
      parameter name: :id, in: :path, type: :string
      response(204, 'successful') do
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

  # path '/api/v1/course/{id}' do
  #   # You'll want to customize the parameter types...
  #   parameter name: 'id', in: :path, type: :string, description: 'id'
  #
  #   get('show course') do
  #     response(200, 'successful') do
  #       let(:id) { '123' }
  #
  #       after do |example|
  #         example.metadata[:response][:content] = {
  #           'application/json' => {
  #             example: JSON.parse(response.body, symbolize_names: true)
  #           }
  #         }
  #       end
  #       run_test!
  #     end
  #   end
  #
  #   patch('update course') do
  #     response(200, 'successful') do
  #       let(:id) { '123' }
  #
  #       after do |example|
  #         example.metadata[:response][:content] = {
  #           'application/json' => {
  #             example: JSON.parse(response.body, symbolize_names: true)
  #           }
  #         }
  #       end
  #       run_test!
  #     end
  #   end
  #
  #   put('update course') do
  #     response(200, 'successful') do
  #       let(:id) { '123' }
  #
  #       after do |example|
  #         example.metadata[:response][:content] = {
  #           'application/json' => {
  #             example: JSON.parse(response.body, symbolize_names: true)
  #           }
  #         }
  #       end
  #       run_test!
  #     end
  #   end
  #
  #   delete('delete course') do
  #     response(200, 'successful') do
  #       let(:id) { '123' }
  #
  #       after do |example|
  #         example.metadata[:response][:content] = {
  #           'application/json' => {
  #             example: JSON.parse(response.body, symbolize_names: true)
  #           }
  #         }
  #       end
  #       run_test!
  #     end
  #   end
  # end
end
