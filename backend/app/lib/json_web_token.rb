require 'base64'
class JsonWebToken

  PUBLIC_KEY = ENV["JWT_PRIVATE_KEY"]

  class << self
    def encode(payload, exp = 2.hours.from_now)
      payload[:exp] = exp.to_i
      JWT.encode(payload, private_key, 'RS256')
    end

    def decode(token)
      body = JWT.decode(token, private_key.public_key, true, { algorithm: 'RS256' })[0]
      HashWithIndifferentAccess.new body
    rescue JWT::DecodeError => e
      raise ExceptionHandler::InvalidToken, e.message
    end



    private
    def private_key
      @private_key ||= OpenSSL::PKey::RSA.new Base64.decode64(PUBLIC_KEY)
    end
  end
end
