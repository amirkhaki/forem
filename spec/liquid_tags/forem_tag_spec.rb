require "rails_helper"

RSpec.describe ForemTag do
  subject(:forem_tag) { described_class }

  let(:article) { create(:article) }
  let(:listing) { create(:listing) }
  let(:organization) { create(:organization) }
  let(:parse_context) { { source: article, user: user } }
  let(:podcast) { create(:podcast) }
  let(:podcast_episode) do
    create(:podcast_episode, podcast_id: podcast.id)
  end
  let(:tag) { create(:tag) }
  let(:user) { create(:user) }

  it "returns StandardError for Forem link that lacks a LiquidTag" do
    invalid_link = "#{URL.url}/terms-of-service"

    expect do
      described_class.new("embed", invalid_link, parse_context)
    end.to raise_error(StandardError)
  end

  describe "determine_klass" do
    it "returns LinkTag if link is general Forem link" do
      link_url = URL.url + article.path

      expect(described_class.determine_klass(link_url)).to eq(LinkTag)
    end

    it "returns ListingTag if link starts with URL.url/listings/" do
      listing_url = "#{URL.url}/listings/#{listing.listing_category}/#{listing.slug}"

      expect(described_class.determine_klass(listing_url)).to eq(ListingTag)
    end

    it "returns OrganizationTag if organization profile link" do
      org_url = "#{URL.url}/#{organization.slug}"

      expect(described_class.determine_klass(org_url)).to eq(OrganizationTag)
    end

    it "returns PodcastTag if podcast episode link" do
      episode_url = "#{URL.url}/#{podcast.slug}/#{podcast_episode.slug}"

      expect(described_class.determine_klass(episode_url)).to eq(PodcastTag)
    end

    it "returns TagTag if link starts with URL.url/t/" do
      tag_url = "#{URL.url}/t/#{tag.name}"

      expect(described_class.determine_klass(tag_url)).to eq(TagTag)
    end

    it "returns UserTag if a user profile link" do
      user_url = "#{URL.url}/#{user.username}"

      expect(described_class.determine_klass(user_url)).to eq(UserTag)
    end
  end
end
