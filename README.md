wiki-sanitize
=============

Very much a WIP. Alerts you when it thinks someone has been paid to contribute to the Wikipedia page you are viewing.


What does it do, exactly?
-------------------------
This Firefox extension uses the [page-mod API](https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/page-mod) to inject itself into all Wikipedia article pages. As per the recently-proposed [Terms of use/Paid contribution amendment](http://meta.wikimedia.org/wiki/Terms_of_use/Paid_contributions_amendment), it then uses the [page-worker API](https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/page-worker) to download the talk page and edit history page for the article, as well as the user pages of the 5 most active editors. It uses [regexes](http://www.w3schools.com/jsref/jsref_obj_regexp.asp) to scan the content of these pages for phrases that may indicate the editor was paid to contribute to the article. When it finds a matching phrase or word, it adds its context to a [panel](https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/panel) overlay so that the user can review the edit summary or relevant talk/user page section and decide for his or herself if the phrase in question represents a conflict of interest.


Matched phrases
---------------
Here is a list of currently matched phrases that will cause an edit summary or user or talk page snippet to be added to the results panel (this is a default list, and really ought to be editable via UI):

Regex | Matched Pattern
------|----------------
pa(y&#124;ying&#124;id&#124;yment) | pay/paying/paid/payment
compensat(e&#124;ed&#124;ion&#124;ing) | compensate/compensated/compensation/compensating
hire(d&#124;s&#124;ing)? | hire/hired/hires/hiring
disclos(e&#124;ed&#124;ure&#124;ing) | disclose/disclosed/disclosure/disclosing
contribut(e&#124;ed&#124;ion&#124;ing) | contribute/contibuted/contribution/contributing
affiliat(e&#124;ed&#124;ion) | affiliate/affiliated/affiliation
client(ele)? | client/clientele
employ(ee&#124;er&#124;ed&#124;ing)? | employ/employee/employer/employed/employing
work(s&#124;ed&#124;ing)? | work/works/worked/working
