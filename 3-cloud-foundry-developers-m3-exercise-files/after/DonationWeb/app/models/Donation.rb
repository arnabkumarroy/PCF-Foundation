require 'rubygems'
require 'active_resource' 

class Donation < ActiveResource::Base
  self.site = SVC_BASE_URL
  # self.element_name = "donation"
  self.format = :json
end