api = 2
core = <%= coreCompatibility %>

;;
; Project-specific Dependencies.
;
; The projects below are additional to the Atrium-based Drupal system to meet
; site-specific functional, infrastructural, and development requirements.
;;

defaults[projects][subdir] = "contrib"
defaults[projects][type] = "module"

defaults[projects][subdir] = "contrib"
defaults[projects][type] = "module"

<% if (memcache) { %><%- include ../make-memcache -%><% } %>
