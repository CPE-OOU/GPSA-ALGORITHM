class Message
    def self.not_found(record = 'record')
      "Sorry, #{record} not found."
    end

    def self.invalid_credentials
      'Invalid credentials'
    end

    def self.invalid_token
      'Invalid token'
    end

    def self.missing_token
      'Missing token'
    end

    def self.unauthorized
      'Unauthorized request'
    end

    def self.user_created
      'Account created successfully'
    end

    def self.user_not_created
      'Account could not be created'
    end

    def self.expired_token
      'Sorry, your token has expired. Please login to continue.'
    end
    def self.post_created
      "Post created successfully"
    end
    def self.login_success
      "logged in successfully"
    end
    def self.invalid_pin
      "invalid authorization"
    end
end
