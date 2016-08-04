class DonationsController < ApplicationController
  def index
	@donorid
	if params[:donor].blank?
  		@donorid = 100
	else
		@donorid = params[:donor]
	end

	@donations = Donation.find(:all, :from => "#{SVC_BASE_URL}/#{@donorid}/donations.json")
  end

  def new

  end

  def create
	# @fullurl = "#{SVC_BASE_URL}/donors/#{params[:donations][:donorid]}"
	# logger.info @fullurl
	# Donation.site = @fullurl
	# convert to integers
	params[:donations][:donorid] = params[:donations][:donorid].to_i
	params[:donations][:donationamount] = params[:donations][:donationamount].to_i
	d = Donation.new(params[:donations])
	d.save

	redirect_to :action => "index", :donor => params[:donations][:donorid]
  end

end
