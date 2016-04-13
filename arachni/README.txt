Download Arachni and place the clickjacking.rb file in:
[ARACHNI]/system/gems/gems/arachni-1.4/components/checks/passive

Open terminal and cd to the Arachni directory then run the following commands to test:

bin/arachni --checks=clickjacking --scope-page-limit 1 --browser-cluster-pool-size 1 https://www.cs.utexas.edu/~kyle/TestDoubleFraming.html
bin/arachni --checks=clickjacking --scope-page-limit 1 --browser-cluster-pool-size 1 https://www.cs.utexas.edu/~kyle/TestReferrerChecking.html
bin/arachni --checks=clickjacking --scope-page-limit 1 --browser-cluster-pool-size 1 https://www.cs.utexas.edu/~kyle/TestOther.html
bin/arachni --checks=clickjacking --scope-page-limit 1 --browser-cluster-pool-size 1 https://www.cs.utexas.edu/~kyle/TestCorrect.html
bin/arachni --checks=clickjacking --scope-page-limit 1 --browser-cluster-pool-size 1 https://www.cs.utexas.edu/~kyle/TestXFrameOptions.php
bin/arachni --checks=clickjacking --scope-page-limit 1 --browser-cluster-pool-size 1 https://www.cs.utexas.edu/~kyle/TestContentSecurityPolicy.php
bin/arachni --checks=clickjacking --scope-page-limit 1 --browser-cluster-pool-size 1 https://www.cs.utexas.edu/~kyle/TestXContentSecurityPolicy.php