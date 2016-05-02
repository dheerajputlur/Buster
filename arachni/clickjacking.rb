=begin

=end

# Checks to see if site is vunerable to clickjacking.
#
# @author Kyle Schmid <kyleschmid@me.com>
class Arachni::Checks::Clickjacking < Arachni::Check::Base

    def run

        print_status 'Running Clickjacking Check'

        http.request( page.url, method: :get) { |response| check_and_log( response ) }
    end

    def check_and_log( response )

        # Check for X-Frame-Options and Content-Security-Policy/X-Content-Security-Policy. Pass if enabled. Continue checks otherwise.
        print_info 'Checking if page has X-Frame-Options enabled'
        if (response.headers.key?('X-Frame-Options') && (response.headers['X-Frame-Options'] == 'DENY' || response.headers['X-Frame-Options'] == 'SAMEORIGIN'))
            print_info 'Page has X-Frame-Options enabled, so it is not vunerable to clickjacking.'
		elsif (response.headers.key?('Content-Security-Policy') && response.headers['Content-Security-Policy'] =~ /frame-ancestors/ && response.headers.key?('X-Content-Security-Policy') && response.headers['X-Content-Security-Policy'] =~ /frame-ancestors/)
			print_info 'Page implements Content-Security-Policy and X-Content-Security-Policy, so it is not vunerable to clickjacking.'
        else

            body = response.to_page.body.gsub(/<!--(.*?)-->/m, "").downcase # remove comments and downcase
            open_scripts = body.split(/<script.*?>/m) # split by script tag
            open_scripts.delete_at(0) # remove whatever is before first script tag
            # populate new array with whatever is before end script tag
            scripts = []
            open_scripts.each { |a| scripts << a.gsub(/<\/script>.*/m, "") }
            scripts.each { |a| print_info a }

            # Check for Double Framing vuneralbility
            print_info 'Checking if page is vunerable to double framing'
            # Check to see if each script tries to access parent.location. If so, it's vunerable to double framing.
            scripts.each { |a|
                if a.include?('parent.location')
                    log( vector: Element::Server.new( response.url ), response: response, proof: a )
                    return
                end
            }

            # Check for referrer checking vunerability
            print_info 'Checking if page is vunerable to an attack exploiting referrer checking'
            # Check to see if each script attempts to look at document.referrer.indexof
            scripts.each { |a|
                if a =~ /document.referrer.indexof/ || a =~ /document.referrer.match/
                    log( vector: Element::Server.new( response.url ), response: response, proof: a )
                    return
                end
            }

            # Check to see if display is none at beginning. Otherwise, many clickjacking attacks will work.
            if !(body =~ /<style.*?>(.*?[\s*\n*;])?html[\s*\n*]?{(.*?[\s*\n*;])?display\s*:\s*none\s*[;\s*\n*]*}.*<\/style>/m)
                log( vector: Element::Server.new( response.url ), response: response, proof: body )
            end
        end
    end

    def self.info
        {
            name:        'Clickjacking',
            description: %q{
Checks to see if a page is vunerable to clickjacking by checking the page for various frame-busting techniques.
},
            author:      'Kyle Schmid (kyleschmid@me.com)',
            version:     '1.0.0',

            issue:       {
                name:                   %q{Clickjacking issue},
                description:            %q{

                This content is courtesy of Gustav Rydstedt,
                Elie Bursztein, and Dan Boneh of Stanford
                University as well as Collin Jackson of
                Carnegie Mellon University as part of the
                publication: Busting Frame Busting: a Study
                of Clickjacking Vulnerabilities on Popular Sites.
                This publication can be found at
                http://w2spconf.com/2010/papers/p27.pdf.

                Clickjacking occurs when an attacking website is
                able to successfully frame a page and use that
                frame in order to hijack a user's web session.
                Many common clickjacking techniques include
                various vunerabilities in the frame busting code:

                - Accessing parent.location: Vunerable to double
                  framing. Accessing parent.location becomes a
                  security violation in major browsers when page
                  is contained within two or more iframes.
                - Checking the referrer: Many folks do not check
                  the referrer correctly. For instance, simply
                  checking to see if the referrer contains the
                  website you are trying to allow is defeated
                  by a subdomain of another domain.
                - Using javascript to bust out of containing
                  frame: can be defeated using various methods
                  including:
                      - Adding an onBeforeUnload event to the
                        frame attributes asking user to cancel in
                        some manner.
                      - Adding an onBeforeUnload event to the
                        frame attributes that submits a navigation
                        request to a site responding with code
                        204 - No Content.
                      - Adding a URL parameter that exploits the
                        XSS filter in popular browsers to disable
                        all javascript, including frame-busting
                        script.
                      - Using attributes such as IE Restricted
                        Zone and Sandbox or Design mode to disable
                        all javascript, including frame-busting
                        script.

                The recommended approach for successfully frame-
                busting is to initially hide all content on the
                page, then use javascript to either bust out of
                the frame or display content. This way, if
                javascript is disabled in some manner, no content
                will be displayed. Here is sample code:

                    <style>
                      html { display:none; }
                    </style>

                    <script>
                      if (self == top) {
                        document.documentElement.style.display = 'block';
                      } else {
                        top.location = self.location;
                      }
                    </script>

                In addition to this method, you could use the
                X-Frame-Options header.
                },
                severity:               Severity::INFORMATIONAL
            }
        }
    end

end
