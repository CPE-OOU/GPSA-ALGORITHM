class UrlHelper
  include Singleton
  include ActionDispatch::Routing::UrlFor
  include Rails.application.routes.url_helpers
end
