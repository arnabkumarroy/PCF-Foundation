if ENV['VCAP_SERVICES'].nil?
	SVC_BASE_URL = 'http://localhost:3001/donors'
else
	SVC_BASE_URL = 'http://psdonationwebservice.cfapps.io/donors'
end