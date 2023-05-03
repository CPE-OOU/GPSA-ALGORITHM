require 'swagger_helper'

RSpec.describe 'api/v1/admin', type: :request do

  path '/api/v1/admin/deactivate' do

    post('deactivate admin') do
      tags 'Admin'
      consumes 'application/json'
      parameter in: :body, schema: {
        type: :object,
        properties: {
          id: { type: :string }
        },
        required: %w[id]
      }
      response(200, 'successful') do
        examples 'application/json' => {
          "id": "84e20de4-0dfb-4423-ab27-0f288c08216a",
          "first_name": "temi",
          "last_name": "suberu",
          "email": "temi@sube.com",
          "role": "admin",
          "status": "active"
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
  end

  path '/api/v1/admin/activate' do

    post('activate admin') do
      tags 'Admin'
      consumes 'application/json'
      parameter in: :body, schema: {
        type: :object,
        properties: {
          id: { type: :string }
        },
        required: %w[id]
      }
      response(200, 'successful') do
        examples 'application/json' => {
          "id": "84e20de4-0dfb-4423-ab27-0f288c08216a",
          "first_name": "temi",
          "last_name": "suberu",
          "email": "temi@sube.com",
          "role": "admin",
          "status": "active"
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
  end

  path '/api/v1/admin' do

    post('create admin') do
      tags 'Admin'
      consumes 'application/json'
      parameter in: :body, schema: {
        type: :object,
        properties: {
          first_name: { type: :string, description: 'first name'  },
          last_name: { type: :string, description: 'last name'  },
          email: { type: :string, description: 'email',  },
        },
        required: %w[first_name last_name email]
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
  end
end
